---
title: 操作系统(3) - 读取文件
createTime: 2025/6/7
---

## 工具

::: code-tree title="改动文件" height="400px"

```c title="src/bootloader/alloc.c" :active
#include "alloc.h"

void* Allocate(UINTN size) {
    void* buf = NULL;
    EFI_STATUS status = BS->AllocatePool(EfiLoaderData, size, &buf);
    if (EFI_ERROR(status)) {
        Err(L"[ERROR] Memory allocation failed!\n");
    }
    return buf;
}

void Free(void* ptr) {
    BS->FreePool(ptr);
}

void* AllocatePagesAt(EFI_PHYSICAL_ADDRESS addr, UINTN num_pages) {
    EFI_STATUS status = 
        BS->AllocatePages(AllocateAddress, EfiLoaderData, num_pages, &addr);
    if (EFI_ERROR(status)) {
        Err(L"[ERROR] Page allocation failed!\n");
    }
    return (void*)(UINTN)addr;
}
```

```c title="src/bootloader/err.c"
#include "err.h"

void Err(CHAR16 *e){
    ST->ConOut->OutputString(ST->ConOut, e);
    while (1){
        __asm__ volatile ("hlt");
    }
}
```

```c title="src/bootloader/bootloader.c"
...
EFI_SYSTEM_TABLE *ST;  // [!code ++]
EFI_BOOT_SERVICES *BS;  // [!code ++]

EFI_STATUS EFIAPI 
efi_main(EFI_HANDLE ImageHandle, EFI_SYSTEM_TABLE *SystemTable){
    ST = SystemTable;  // [!code ++]
    BS = SystemTable->BootServices;  // [!code ++]
    ...
}
```

```cpp title="src/bootloader/output.c"
#include "output.h"

void PutStr(CHAR16 *s){
    ST->ConOut->OutputString(ST->ConOut, s);
}

void PutChar(CHAR16 c){
    CHAR16 s[2] = {c, 0};
    ST->ConOut->OutputString(ST->ConOut, s);
}

void PrintHex(UINTN val){
    CHAR16 buf[32];
    int len = 0;

    if (val == 0){
        len = 1;
        buf[0] = L'0';
    }

    while (val){
        UINTN nibble = val & 0xF;
        buf[len] = (nibble < 10)? (L'0'+nibble) : (L'A'+nibble-10);
        len++;
        val >>= 4;
    }

    PutStr(L"0x");
    for (int i=len-1; i>=0; i--){
        PutChar(buf[i]);
    }
}

void PrintDec(UINTN val){
    CHAR16 buf[32];
    int len = 0;

    if (val == 0){
        len = 1;
        buf[0] = L'0';
    }

    while (val){
        buf[len] = L'0' + val % 10;
        val /= 10;
        len++;
    }

    for (int i=len-1; i>=0; i--){
        PutChar(buf[i]);
    }
}
```

:::

文件多了起来，相应地，Makefile 也要有些改动，将文件夹中的文件一并编译并链接到一起。

```makefile title="makefile"
BOOT_DIR    := src/bootloader
BUILD_DIR   := build
OBJ_DIR     := $(BUILD_DIR)/obj
BOOT_OBJ_DIR:= $(OBJ_DIR)/bootloader
BOOT_SRCS   := $(wildcard $(BOOT_DIR)/*.c)
BOOT_OBJS   := $(patsubst $(BOOT_DIR)/%.c, $(BOOT_OBJ_DIR)/%.obj, $(BOOT_SRCS))

# === Compile Bootloader .c → .obj ===
$(BOOT_OBJ_DIR)/%.obj: $(BOOT_DIR)/%.c | $(BOOT_OBJ_DIR)
    $(CLANG) $(CFLAGS) -c $< -o $@

# === Link .obj → BOOTX64.EFI ===
$(BUILD_DIR)/BOOTX64.EFI: $(BOOT_OBJS)
    $(LLD_LINK) $(LDFLAGS_EFI) $(BOOT_OBJS)
```

## 卷

Volume，即“卷”。在 UEFI 中，必须通过 Volume 才能打开文件。

```c
EFI_FILE_HANDLE GetVolume(EFI_HANDLE image) {
    // From OS dev wiki
    EFI_LOADED_IMAGE *loaded_image = NULL;                  /* image interface */
    EFI_GUID lipGuid = EFI_LOADED_IMAGE_PROTOCOL_GUID;      /* image interface GUID */
    EFI_FILE_IO_INTERFACE *IOVolume;                        /* file system interface */
    EFI_GUID fsGuid = EFI_SIMPLE_FILE_SYSTEM_PROTOCOL_GUID; /* file system interface GUID */
    EFI_FILE_HANDLE Volume;                                 /* the volume's interface */

    /* get the loaded image protocol interface for our "image" */
    uefi_call_wrapper(BS->HandleProtocol, 3, image, &lipGuid, (void **) &loaded_image);
    /* get the volume handle */
    uefi_call_wrapper(BS->HandleProtocol, 3, loaded_image->DeviceHandle, &fsGuid, (VOID*)&IOVolume);
    uefi_call_wrapper(IOVolume->OpenVolume, 2, IOVolume, &Volume);

    return Volume;
}
```

有新的函数了：`uefi_call_wrapper()` 是什么？实际上，`uefi_call_wrapper(F, n, A1, ..., An)` 相当于 `F(A1, ..., An)`，是用来解决 ABI 的函数调用约定不同的问题的。如果没有这种问题，可以直接使用后者，更清晰。

## 读

Volume 有经典的 Open / Read / Close 抽象，处理起来容易多了。

```c
void* ReadFile(EFI_FILE_HANDLE Volume, CHAR16 *Path, UINT64 outSize) {
    EFI_FILE_HANDLE FileHandle;
    uefi_call_wrapper(Volume->Open, 5, Volume, &FileHandle, Path, EFI_FILE_MODE_READ, 0);

    UINT64 ReadSize = FileSize(FileHandle);  // TODO
    UINT8 *Buffer = Allocate(ReadSize);
    uefi_call_wrapper(FileHandle->Read, 3, FileHandle, &ReadSize, Buffer);

    uefi_call_wrapper(FileHandle->Close, 1, FileHandle);

    if (outSize){
        *outSize = ReadSize;
    }

    return Buffer;
}
```

## Info

`FileSize` 的获取要难一些。像为了醋包饺子一样，必须把整个 `FileInfo` 读到内存。而要把这一个大东西读到内存，必须先使用同一个函数获取它的大小。!!什么套娃!!

:::tip

这种第一次调用查询大小，第二次调用读取信息的方式，之后还会遇到。

:::

```c
EFI_GUID gEfiFileInfoGuid = EFI_FILE_INFO_ID;

EFI_FILE_INFO* GetFileInfo(EFI_FILE_HANDLE FileHandle){
    EFI_STATUS status;
    UINTN FileInfoSize = 0;
    EFI_FILE_INFO *FileInfo = NULL;

    status = FileHandle->GetInfo(FileHandle, &gEfiFileInfoGuid, &FileInfoSize, NULL);
    if (status != EFI_BUFFER_TOO_SMALL) {
        Err(L"[ERROR] GetInfo (size query) failed.\n");
    }

    FileInfo = (EFI_FILE_INFO*) Allocate(FileInfoSize);
    if (FileInfo == NULL){
        Err(L"[ERROR] Failed to allocate memory for file info.\n");
    }

    status = FileHandle->GetInfo(FileHandle, &gEfiFileInfoGuid, &FileInfoSize, FileInfo);
    if (EFI_ERROR(status)){
        Free(FileInfo);
        Err(L"[ERROR] GetInfo (actual) failed.\n");
    }

    return FileInfo;
}

UINT64 FileSize(EFI_FILE_HANDLE FileHandle) {
    EFI_FILE_INFO *FileInfo = GetFileInfo(FileHandle);
    UINT64 size = FileInfo->FileSize;
    Free(FileInfo);
    return size;
}
```

## 牛刀小试

```c title="src/bootloader.c"
#include <efi.h>
#include <efilib.h>
#include <elf.h>
#include "alloc.h"
#include "fs.h"

typedef void (*KERNEL_ENTRY)(void);

EFI_SYSTEM_TABLE *ST;
EFI_BOOT_SERVICES *BS;

void PrintChar8Line(CHAR8 *s){
    for (; *s; s++){
        if (*s == '\n'){
            ST->ConOut->OutputString(ST->ConOut, L"\r\n");
            return;
        } 
        PutChar((CHAR16)*s);
    }
}

EFI_STATUS EFIAPI 
efi_main(EFI_HANDLE ImageHandle, EFI_SYSTEM_TABLE *SystemTable){
    ST = SystemTable;
    BS = SystemTable->BootServices;

    ST->ConOut->ClearScreen(ST->ConOut);
    ST->ConOut->OutputString(ST->ConOut, L"Hello, world!\r\n");

    EFI_FILE_HANDLE Volume = GetVolume(ImageHandle);
    ST->ConOut->OutputString(ST->ConOut, L"Hello, Volume!\r\n");

    CHAR8 *Buffer = ReadFile(Volume, L"\\hello.txt", NULL);
    ST->ConOut->OutputString(ST->ConOut, L"Hello, File!\r\n");

    PrintChar8Line(Buffer);
    Free(Buffer);

    while(1) __asm__ volatile ("hlt");
}
```

接下来，我们新建 **hello.txt** 并写入

```txt
Hello from txt!
# only print 1 line
# use '\n' because '\0' is hard to type
```

然后在 Makefile 新增

```makefile {3}
$(BUILD_DIR)/esp.img: $(BUILD_DIR)/BOOTX64.EFI
    ...
    mcopy -i esp.img hello.txt ::/
```

运行 `make all run`，你就可以看到系统的问候：

```
world!
Hello, Volume!
Hello, File!
Hello from txt!
```
