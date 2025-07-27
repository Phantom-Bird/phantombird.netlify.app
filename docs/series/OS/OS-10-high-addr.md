---
title: 操作系统(10) - 跳转高址
createTime: 2025/7/12
---

请注意：这一章是重构章，因此主要以修改记录的方式来呈现。

## 为什么要跳转到高地址？

我们即将进入用户模式。为了不让用户意外访问内核地址（会触发 #GPF），就要给内核搬个家。

## 分离虚拟地址与物理地址

首先，我们之前内核的写法是虚拟地址、物理地址不分的。我们必须区分二者，才能适应高地址映射。

核心代码是一个转换函数：

```c
typedef uint64_t PhysicalAddress;

static inline void* phys2virt(PhysicalAddress phys){
    return (void*) phys;  // 暂时为恒等映射
}
```

::: code-tree title="incenterOS" height="600px"

```c title="src/kernel /paging.c"
PageTable kernel_pml4;  // 内核页表根

PageTable alloc_table(){  // [!code --:3]
    PageTable page = (PageTable) alloc_page();
    if (!page) {
PhysicalAddress alloc_table(){  // [!code ++:3]
    PhysicalAddress page_phys = alloc_page();
    if (!page_phys) {
        raise_err("[ERROR] Cannot alloc new page!");
    }

    PageTable page = (PageTable) phys2virt(page_phys);  // [!code ++]
    memset(page, 0, PAGE_SIZE);
    return page;  // [!code --]

    return page_phys;  // [!code ++]
}

PageTable get_or_alloc_table_of(PageTableEntry* entry, uint64_t flags) {
    if (!(entry->present)) {
        void *table = alloc_table();  // [!code --:2]
        entry->value = ((uint64_t)table) | flags;
        PhysicalAddress table_phys = alloc_table();  // [!code ++:2]
        entry->value = table_phys | flags;
    }
    
    return (uint64_t*)(entry->value & ~(PAGE_SIZE-1));  // [!code --]
    return (uint64_t*) phys2virt(entry->value & ~(PAGE_SIZE-1));  // [!code ++]
}

...

void paging_set_root(){
    kernel_pml4 = alloc_table();  // [!code --]
    kernel_pml4 = phys2virt(alloc_table());  // [!code ++]
    if (!kernel_pml4){
        raise_err("[ERROR] Cannot alloc PML4 table.");
    }
```

```c title="src/kernel /pmm_alloc.c"
void* alloc_page(){  // [!code --]
PhysicalAddress alloc_page(){  // [!code ++]
    for (size_t i = last_pos; i < MAX_PAGE_COUNT; i++){
        if (!test_bit(page_bitmap, i)){
            set_bit(page_bitmap, i);
            last_pos = i + 1;
            return (void*) (i * PAGE_SIZE);  // [!code --]
            return i * PAGE_SIZE;   // [!code ++]
        }
    }
    return NULL;  // [!code --]
    return 0;  // [!code ++]
}

void free_page(size_t addr){  // [!code --]
void free_page(PhysicalAddress addr){  // [!code ++]
    ...
}
```

```c title="src/kernel/kmalloc.c"
void *addr = alloc_page();  // [!code --]
void *addr = phys2virt(alloc_page());  // [!code ++]
```

:::

## 在 Bootloader 设置页表

内核自己把自己挪到高地址是非常困难的。因此，我们要将页表的构建前移到 bootloader。

请注意：CR3 要在最后设置。

::: code-tree title="incenterOS" height="600px"

```c title="src/bootloader/paging_adapter.c"
#include "output.h"
#include "err.h"
#include "efi.h"

void raise_err(char *err){
    for (; *err; err++){
        PutChar((CHAR16){*err, 0});
    }

    Err(L"");
}

EFI_PHYSICAL_ADDRESS alloc_page(){
    EFI_STATUS status;
    EFI_PHYSICAL_ADDRESS Memory;

    status = gBS->AllocatePages(
        AllocateAnyPages,        // 分配任意可用页
        EfiLoaderData,
        1,
        &Memory                 // 返回分配的物理地址
    );

    if (EFI_ERROR(status)) {
        return 0;
    }
    return Memory;
}
```

```c title="src/bootloader/bootloader.c"
void init_paging(BootInfo boot_info);  // [!code ++]
EFI_STATUS EFIAPI 
efi_main(EFI_HANDLE ImageHandle, EFI_SYSTEM_TABLE *SystemTable) {
    ...

    PutStr(L"[BOOT] Initalizing paging...\r\n");  // [!code ++:3]
    UINT64 MemSize = GetMemSize();
    paging_set_root();

    ...
    BI.mem.phys_mem_size = GetMemSize();  // [!code ++:12]
    BI.pml4_phys = pml4_phys;

    PutStr(L"[BOOT] Mapping virtual address...\r\n");
    init_paging(BI);
    
    PutStr(L"[BOOT] Exiting boot...\r\n");
    UINTN MapKey;
    GetMemMap(&BI.mem.mem_map, &BI.mem.count, &BI.mem.desc_size, &MapKey);
    ExitBootDevices(ImageHandle, MapKey);
    
    __asm__ volatile("mov %0, %%cr3" :: "r"(pml4_phys));  // 调用函数的话接下来可能会出事

    ...
}

#define MB (1024 * 1024)  // [!code ++:24]
#define APIC_DEFAULT_BASE 0xFEE00000
#define IOAPIC_DEFAULT_BASE  0xFEC00000

void init_paging(BootInfo boot_info){
    // 内核
    map_pages(0, boot_info.mem.phys_mem_size, 0, PRESENT | WRITABLE);  // 恒等
    // 已经包括栈

    // 帧缓冲区
    uint64_t fb_base = (uint64_t)(boot_info.graphics.framebuffer);
    uint64_t fb_size = boot_info.graphics.size_bytes;  // BI 新增项目
    map_pages(fb_base, fb_size, fb_base, PRESENT | WRITABLE);

    // APIC MMIO
    map_pages(APIC_DEFAULT_BASE, 0x1000, APIC_DEFAULT_BASE, PRESENT | WRITABLE);
    map_pages(IOAPIC_DEFAULT_BASE, 0x1000, IOAPIC_DEFAULT_BASE, PRESENT | WRITABLE);

    // initrd
    map_pages(boot_info.initrd.start, 
              boot_info.initrd.size, 
              boot_info.initrd.start,
              PRESENT | WRITABLE);
}
```

```c title="src/bootloader/paging.c"
#define BOOTLOADER  // [!code ++:5]

#include "../shared/paging.c"

#undef BOOTLOADER
```

```c title="src/bootloader/paging.h"
#pragma once  // [!code ++:7]

#define BOOTLOADER

#include "../shared/paging.h"

#undef BOOTLOADER
```

```c title="src/kernel /kernel.c"
void init_paging();  // [!code --]

void kernel_main(){
    ...

    paging_load_root(boot_info.pml4_phys);  // [!code ++]

    InitGOPFrom(boot_info.graphics);
    ClearScreen();
    set_scaling(1, 2);

    print("[KERNEL] Successfully loaded page table!\n");  // [!code ++]

    __asm__ volatile ("cli");

    ...
    
    print("[KERNEL] Initializing paging...\n");  // [!code --:5]
    paging_set_root();
    init_paging();
    print("[KERNEL] Loading page table...\n");
    set_cr3();
    
    ...
}
```

```c title="src/kernel /paging.c"
**DELETED ALL**  // [!code --]
#define KERNEL  // [!code ++:3]

#include "../shared/paging.c"
```

```c title="src/kernel /paging.h"
**DELETED ALL**    // [!code --]

#pragma once  // [!code ++:7]

#define KERNEL

#include "../shared/paging.h"

#undef KERNEL
```

```c title="src/shared/bootinfo.h"
...

typedef struct {
    EFI_MEMORY_DESCRIPTOR *mem_map;
    uint64_t count;
    uint64_t desc_size;
    uint64_t phys_mem_size;  // [!code ++]
} MemMapInfo;

...

typedef struct {
    StackInfo stack;
    MemMapInfo mem;
    InitrdInfo initrd;
    uint64_t pml4_phys;  // [!code ++]
} BootInfo;
```

:::

## 映射数据区域到高地址

以下，我们先映射数据区域到高地址。以下是映射的地址。为了内核访问物理内存方便，我们会把整块物理内存映射到高地址。

```c title="src/shared/addr.h"
#pragma once

#define KB (1ull << 10)
#define MB (1ull << 20)
#define GB (1ull << 30)
#define TB (1ull << 40)

#define APIC_DEFAULT_BASE      0xFEE00000
#define IOAPIC_DEFAULT_BASE    0xFEC00000

#define APIC_VIRT_BASE      0xFFFFFFFFFEE00000
#define IOAPIC_VIRT_BASE    0xFFFFFFFFFEC00000
#define FB_VIRT_BASE        0xFFFFFFFFC0000000
#define STACK_VIRT_BASE     0xFFFFFFFF80000000
#define INITRAMFS_POOL_VIRT 0xFFFFFFF800000000

#define HIGH_ADDR           0xFFFF800000000000
#define PHYS_MAP_MAX        (8 * TB)
#define HIGH_ADDR_END       (HIGH_ADDR + PHYS_MAP_MAX)
```

此时，`phys2virt` 就会变成下面这样：

```c
#ifdef BOOTLOADER
#define PHYS_BASE 0
#endif
#ifdef KERNEL
#define PHYS_BASE HIGH_ADDR
#endif

#ifdef PHYS_BASE
static inline void* phys2virt(PhysicalAddress phys){
    return (void*)phys + PHYS_BASE;
}
#endif
```

我们把地址映射与迁移相关的代码全部写入 High Address Loader：

```c title="src/bootloader/hloader.c"
#include "hloader.h"
#include "paging.h"
#include "../shared/addr.h"

#define MB (1024 * 1024)

void InitPaging(BootInfo boot_info){
    // 全内存（主要是内核，供内核使用）
    uint64_t mem_size = boot_info.mem.phys_mem_size;
    if (mem_size > PHYS_MAP_MAX){
        mem_size = PHYS_MAP_MAX;
    }

    map_pages(HIGH_ADDR, mem_size, 0, PRESENT | WRITABLE); 
    map_pages(0, 8*MB, 0, PRESENT | WRITABLE);  // 恒等，此处只映射内核以确保其他数据映射完整
    // 内核栈
    map_pages(STACK_VIRT_BASE, boot_info.stack.size, boot_info.stack.base_addr, PRESENT | WRITABLE);

    // 帧缓冲区
    uint64_t fb_base = (uint64_t)(boot_info.graphics.framebuffer);
    uint64_t fb_size = boot_info.graphics.size_bytes;
    map_pages(FB_VIRT_BASE, fb_size, fb_base, PRESENT | WRITABLE | UNCACHEABLE);

    // APIC MMIO
    map_pages(APIC_VIRT_BASE, 0x1000, APIC_DEFAULT_BASE, PRESENT | WRITABLE | UNCACHEABLE);
    map_pages(IOAPIC_VIRT_BASE, 0x1000, IOAPIC_DEFAULT_BASE, PRESENT | WRITABLE | UNCACHEABLE);
}

BootInfo* TranslateBI(BootInfo *BI){
    BI->mem.mem_map = (void*)BI->mem.mem_map + HIGH_ADDR;
    BI->initrd.start = (void*)BI->initrd.start + HIGH_ADDR;

    BI->graphics.framebuffer = (void*)FB_VIRT_BASE;
    BI->stack.base_addr = STACK_VIRT_BASE;

    return (void*)BI + HIGH_ADDR;
    // 必须转成 (void*)，因为 ptr + idx 相当于 &ptr[idx]
}
```

::: code-tree title="incenterOS" height="600px"

```c title="src/bootloader/bootloader.c"
#include "output.h"
#include "gop.h"
#include "../shared/graphics/logo.h"
#include "hloader.h"  // [!code ++:3]
#include "../shared/addr.h"
#include "paging.h"

EFI_SYSTEM_TABLE *ST;
EFI_BOOT_SERVICES *BS;
BootInfo BI;

// 规避和栈有关的乱七八糟的问题  // [!code ++:3]
KERNEL_ENTRY KernelEntry;
void *BIVirt;

EFI_STATUS EFIAPI 
efi_main(EFI_HANDLE ImageHandle, EFI_SYSTEM_TABLE *SystemTable) {

    PutStr(L"[BOOT] Loading kernel...\r\n");
    void *KernelBuffer = ReadFile(Volume, L"\\kernel.elf", NULL);
    KERNEL_ENTRY KernelEntry = LoadKernel(KernelBuffer);  // [!code --]
    KernelEntry = LoadKernel(KernelBuffer);  // [!code ++]
    SystemTable->BootServices->FreePool(KernelBuffer);

    ...

    PutStr(L"[BOOT] Initalizing paging...\r\n");
    paging_set_root();

    PutStr(L"[BOOT] Initalizing boot info...\r\n");
    BI.magic = MAGIC;
    ...
    BI.graphics.pitch = Pitch;
    BI.stack.base_addr = KernelStackBase;
    BI.stack.size = KernelStackSize;
    BI.mem.phys_mem_size = GetMemSize();
    BI.initrd.start = (EFI_PHYSICAL_ADDRESS)InitRDStart;
    BI.initrd.start = InitRDStart;
    BI.initrd.size = InitRDSize;
    BI.pml4_phys = pml4_phys;

    init_paging(BI);  // [!code --]
    InitPaging(BI);  // [!code ++:7]

    // 临时映射 bootloader
    uint64_t rip;
    __asm__ volatile ("leaq (%%rip), %0" : "=r"(rip));
    PutStr(L"[BOOT] RIP="); PrintHex(rip); PutStr(L"\r\n");
    map_pages(rip &~0xFFF, 2*MB, rip &~0xFFF, WRITABLE | PRESENT);
    
    PutStr(L"[BOOT] Exiting boot...\r\n");
    UINTN MapKey;
    GetMemMap(&BI.mem.mem_map, &BI.mem.count, &BI.mem.desc_size, &MapKey);
    ExitBootDevices(ImageHandle, MapKey);

    BIVirt = TranslateBI(&BI);  // [!code ++:3]

    __asm__ volatile ("mov %0, %%cr3" :: "r"(pml4_phys));

    __asm__ volatile (
        // "r" 的参数将在内联汇编之前放入寄存器，因此可以使用局部变量  // [!code ++:2]
        // 但是为了避免奇奇怪怪的问题我们还是用全局变量
        "mov %[stack], %%rsp\n"
        "mov %[info], %%rdi\n"
        "jmp *%[entry]\n"
        :
        : [stack] "r"(KernelStackTop)  // [!code --:2]
          [info] "r"(&BI),
        : [stack] "r"(BI.stack.base_addr + BI.stack.size),  // [!code ++:3]
          // 注意：x86 是满递减栈；rsp 指向有效内存的下一个地址
          [info] "r"(BIVirt),
          [entry] "r"(KernelEntry)
    );

    return EFI_SUCCESS;
}
 // 后面的都删掉  // [!code --]
```

```c title="src/kernel /apic.c"
#define APIC_BASE_MSR 0x1B
#define APIC_SVR 0xF0
#define APIC_ENABLE 0x100
#define APIC_LVT_LINT0 (APIC_DEFAULT_BASE + 0x350)  // [!code --]
#define APIC_LVT_LINT0 (APIC_VIRT_BASE + 0x350)  // [!code ++]
```

```c title="src/kernel /apic.h"
#pragma once
#include <stdint.h>

#define APIC_DEFAULT_BASE 0xFEE00000  // [!code --:2]
#define IOAPIC_DEFAULT_BASE  0xFEC00000
#include "../shared/addr.h"  // [!code ++]

#define APIC_EOI 0xB0
#define IOAPIC_REGSEL  0xFEC00000  // [!code --:2]
#define IOAPIC_WINDOW  0xFEC00010
#define IOAPIC_REGSEL  IOAPIC_VIRT_BASE  // [!code ++:2]
#define IOAPIC_WINDOW  (IOAPIC_VIRT_BASE + 0x10)

static inline void apic_write(uint32_t reg, uint32_t val) {
    ((volatile uint32_t*)APIC_DEFAULT_BASE)[reg / 4] = val;  // [!code --]
    ((volatile uint32_t*)APIC_VIRT_BASE)[reg / 4] = val;  // [!code ++]
}

static inline uint32_t apic_read(uint32_t reg) {
    return ((volatile uint32_t*)APIC_DEFAULT_BASE)[reg / 4];  // [!code --]
    return ((volatile uint32_t*)APIC_VIRT_BASE)[reg / 4];  // [!code ++]
}
```

```c title="src/kernel /initramfs.c"
#include "print.h"
#include "pool.h"
#include "hash.h"
#include "../shared/addr.h"  // [!code ++]

#define INITRAMFS_POOL_VIRT      0xFFFFFFFF80000000  // [!code --]
#define INITRAMFS_POOL_MAX       (1 << 30)  // 1 GB
#define INITRAMFS_POOL_INIT_SIZE (1 << 24)  // 16MB

...
```

```c title="src/kernel /kernel.c"
void kernel_main(){
    ...

    print("[KERNEL] Loading initrd...\n");
    cpio_init((void*)boot_info.initrd.start, boot_info.initrd.size);  // [!code --]
    cpio_init(boot_info.initrd.start, boot_info.initrd.size);  // [!code ++]
    
    print("[KERNEL]\n");
    FSItem *file_info = initramfs_find(NULL, "/dir/ciallo.txt");
} 
```

```c title="src/shared/bootinfo.h"
...

typedef struct {
    uint64_t start;  // [!code --]
    void *start;  // [!code ++]
    uint64_t size;
} InitrdInfo;
```

:::

## 在高地址运行内核

经过了前面的准备工作，我们就可以很轻松地把内核挪到高地址了。只需改写链接器和加载代码即可。

```linkerscript title="src/kernel /linker.ld"
ENTRY(kernel_entry)

SECTIONS {
    . = 0x100000;  // [!code --]
    . = 0xFFFF800000100000;  // [!code ++]
    .text : { *(.text*) }
    .data : { *(.data*) }
    .bss  : { *(.bss*)  }
}
```

```c title="src/bootloader/loadkernel.c"
KERNEL_ENTRY LoadKernel(void *KernelBuffer) {
    ...

    for (...){
        ...
        void *src = KernelBuffer + ph->p_offset;
        void *dest = (void*)(UINTN) ph->p_vaddr;  // [!code --]
        void *dest = (void*)(UINTN) ph->p_vaddr - HIGH_ADDR;  // [!code ++]

        EFI_PHYSICAL_ADDRESS addr = ph->p_vaddr & ~PageMask;  // [!code --]
        EFI_PHYSICAL_ADDRESS addr = (UINTN)dest & ~PageMask;  // [!code ++]
        UINTN num_pages = (ph->p_memsz + PageSize-1) / PageSize;

        TryAllocPagesAt(addr, num_pages);
        ...
    }

    ...

    return (KERNEL_ENTRY)(UINTN)(ehdr->e_entry);  // 链接器决定的高地址
}
```
