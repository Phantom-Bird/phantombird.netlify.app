---
title: 操作系统(4) - 加载程序
createTime: 2025/6/8
---

## 生成 ELF

想要加载程序，我们先得有一个。

```cpp title="src/kernel /kernel.c"
int kernel_entry(){
    return 123456;
}
```

:::warning

这显然不是真正的内核。我只是懒得改名字而已。

:::

然后，编译。

:::code-tree title="改动" height="400px"

```ld title="src/kernel /linker.ld"
ENTRY(kernel_entry)

SECTIONS {
    . = 0x100000;
    .text : { *(.text*) }
    .data : { *(.data*) }
    .bss  : { *(.bss*)  }
}
```

```makefile title="makefile"
KERNEL_DIR  := $(SRC_DIR)/kernel
KERN_OBJ_DIR:= $(OBJ_DIR)/kernel
KERNEL_SRCS := $(wildcard $(KERNEL_DIR)/*.c)
KERNEL_OBJS := $(patsubst $(KERNEL_DIR)/%.c, $(KERN_OBJ_DIR)/%.obj, $(KERNEL_SRCS))
KERNEL_ELF  := $(BUILD_DIR)/kernel.elf

CFLAGS_KERN := -I$(INC_DIR) -ffreestanding -m64 -mno-red-zone -Wall -Wextra
LDFLAGS_KERN:= -nostdlib -z noexecstack -T$(KERNEL_DIR)/linker.ld

# === Build Kernel ===
$(KERNEL_OBJ): $(KERNEL_SRC) | $(BUILD_DIR)
    $(CLANG) $(CFLAGS_KERN) -c $< -o $@

$(KERNEL_ELF): $(KERNEL_OBJ)
    $(LD) $(LDFLAGS_KERN) -o $@ $^

# === Create ESP Image ===
$(ESP_IMG): $(EFI_FILE) $(KERNEL_ELF)
    ...
    mcopy -i $@ $(KERNEL_ELF) ::/
```

:::

运行 `make`，应该可以看到 `esp.img` 里面有了一个 `kernel.elf` 文件。

## ELF 结构

一个 ELF 文件可以视作这样：

| 部分 | 位置 | 描述 |
| ----------- | ----------- | ----------- |
| ELF header | `0, size = 64` | ELF 文件头 |
| Program Headers | `e_phoff, count = e_phnum, size = e_phentsize` | 描述各个段的信息 |
| Section Headers | - | 这里不用 |
| Segment Data | `p_offset, size = ph->memsz` | 数据，程序 |

其中，我们需要将类型为 `PT_LOAD` 的段加载到 `p_vaddr` 处。此处，需要使用 `AllocatePages` 才能确定地址。

## 加载程序

```c title="src/bootloader/loadkernel.c"
#include "loadkernel.h"
// KERNEL_ENTRY type is defined at .h

KERNEL_ENTRY LoadKernel(void *KernelBuffer) {
    Elf64_Ehdr *ehdr = (Elf64_Ehdr*) KernelBuffer;

    if (ehdr->e_ident[EI_MAG0] != ELFMAG0 ||
        ehdr->e_ident[EI_MAG1] != ELFMAG1 ||
        ehdr->e_ident[EI_MAG2] != ELFMAG2 ||
        ehdr->e_ident[EI_MAG3] != ELFMAG3){
            Err(L"Error: Invalid ELF");
    }

    Elf64_Phdr *phdrs = (Elf64_Phdr*) (KernelBuffer + ehdr->e_phoff);

    for(int i=0; i<ehdr->e_phnum; i++){
        Elf64_Phdr *ph = &phdrs[i];
        if (ph->p_type != PT_LOAD){
            continue;
        }

        void *src = KernelBuffer + ph->p_offset;
        void *dest = (void*)(UINTN) ph->p_vaddr;

        // #define PageSize 0x1000 at .h
        EFI_PHYSICAL_ADDRESS addr = ph->p_vaddr & ~(PageSize-1);
        UINTN num_pages = (ph->p_memsz + PageSize-1) / PageSize;

        PutStr(L"[KERNEL] Loading segment ");
        PrintDec(i);
        PutStr(L", allocate: addr=");
        PrintHex(addr);
        PutStr(L", pages=");
        PrintDec(num_pages);

        if (IsPageAllocated(addr, num_pages)){
            PutStr(L" ... Skipped.\r\n");
        } else {
            PutStr(L"\r\n");
            AllocatePagesAt(addr, num_pages);
        }

        BS->CopyMem(dest, src, ph->p_filesz);

        if (ph->p_memsz > ph->p_filesz){
            BS->SetMem((uint8_t*)dest + ph->p_filesz, ph->p_memsz - ph->p_filesz, 0);
        }
    }

    return (KERNEL_ENTRY)(UINTN)(ehdr->e_entry);
}
```

为了避免重复 alloc 一页内存导致错误，我们在 `alloc.c` 加入检查：

```c title="src/bootloader/alloc.c"
...

#define MAX_ALLOCATED 128
static EFI_PHYSICAL_ADDRESS AllocatedPages[MAX_ALLOCATED];
static UINTN AllocatedCnt = 0;

void* AllocatePagesAt(EFI_PHYSICAL_ADDRESS addr, UINTN num_pages){
    EFI_STATUS status = BS->AllocatePages(AllocateAddress, EfiLoaderData, num_pages, &addr);
    if (EFI_ERROR(status)){
        Err(L"[ERROR] Page allocation failed!\r\n");
    }

    for (int i=0; i<=num_pages; i++){
        if (AllocatedCnt >= MAX_ALLOCATED){
            Err(L"[ERROR] Allocated records overflow.\r\n");
        }
        AllocatedPages[AllocatedCnt] = addr + i * PageSize;
        AllocatedCnt++;
    }

    return (void*) (UINTN) addr;
}

BOOLEAN IsPageAllocated(EFI_PHYSICAL_ADDRESS addr, UINTN num_pages){
    EFI_PHYSICAL_ADDRESS range_end = addr + num_pages * PageSize;

    for (int i=0; i<AllocatedCnt; i++){
        EFI_PHYSICAL_ADDRESS base = AllocatedPages[i];
        EFI_PHYSICAL_ADDRESS end = base + PageSize;

        if (!(addr>=end || range_end<=base)){
            return TRUE;
        }
    }

    return FALSE;
}
```

## 测试

```c title="src/bootloader/bootloader.c"
#include <efi.h>
#include <efilib.h>
#include <elf.h>
#include "alloc.h"
#include "fs.h"
#include "loadkernel.h"
#include "exitboot.h"
#include "output.h"

EFI_SYSTEM_TABLE *ST;
EFI_BOOT_SERVICES *BS;

EFI_STATUS EFIAPI 
efi_main(EFI_HANDLE ImageHandle, EFI_SYSTEM_TABLE *SystemTable) {
    ST = SystemTable;
    BS = SystemTable->BootServices;

    SystemTable->ConOut->ClearScreen(SystemTable->ConOut);
    PutStr(L"Booting...\r\n");

    EFI_FILE_HANDLE Volume = GetVolume(ImageHandle);
    PutStr(L"[BOOT] Reading kernel...\r\n");
    void *KernelBuffer = ReadFile(Volume, L"\\kernel.elf");
    PutStr(L"[BOOT] Loading kernel...\r\n");
    KERNEL_ENTRY KernelEntry = LoadKernel(KernelBuffer);
    PutStr(L"[BOOT] Loaded kernel.\r\n");
    SystemTable->BootServices->FreePool(KernelBuffer);

    PutStr(L"Calling ...\r\n");
    PrintDec(KernelEntry());

    while (1)   {
        __asm__ volatile ("hlt");
    }

    return EFI_SUCCESS;
}
```

输出 `123456` 就是成功了。

## ABI 问题

如果你尝试过传参，你就会发现参数不能正确传递。这是 ABI 的差异导致的。

UEFI 使用的是 Microsoft ABI，而 UNIX 使用的是 System V ABI.  
Microsoft ABI 中，前 4 个**整数**参数从左到右分别在 rcx, rdx, r8, r9 中传递；System V ABI 中，前 6 个参数分别在寄存器 rdi, rsi, rdx, rcx, r8, r9 中传递。  
两种 ABI 都是使用 rax 返回值的，因此可以正常返回。

一个暂时的解决方案是我们写一个桥接函数。

```c
#define UINTN unsigned long long int

UINTN kernel_main(UINTN, UINTN);

__attribute__ ((ms_abi))
UINTN kernel_entry(UINTN a, UINTN b) {
    return kernel_main(a, b);
}

UINTN kernel_main(UINTN a, UINTN b){
    return a + b;
}
```

看看成果：

```out
Booting... 
[BooT] Reading kernel
[BOOT] Loading kernel...
[KERNEL] Loading segment 0, allocate: addr=0x100000, pages=1
[BOOT] Loaded kernel.
123+456=579
```

之后我们会直接使用汇编跳转，直接写寄存器，就不用理会复杂的 ABI 了。
