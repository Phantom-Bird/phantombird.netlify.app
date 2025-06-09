---
title: 操作系统(2) - 世界你好
createTime: 2025/6/7
---

## 目录结构

后面会用到，由于本人懒得改，现在先把目录结构定好。

::: file-tree

- project
  - src/
    - bootloader.c
  - build/
    - ...
  - inc/
    - ...
  - makefile

:::

## 编写程序

编辑 `bootloader.c`，导入 `efi.h` 和 `efiapi.h`，都是些接口的定义。  
如果想拆轮子，直接手写指针偏移量也可以，但可读性差很多。

主函数原型：

```c
EFI_STATUS EFIAPI 
efi_main(EFI_HANDLE ImageHandle, EFI_SYSTEM_TABLE *SystemTable);
```

`SystemTable` 包含了若干个表，其中就有我们需要的工具函数。

调用时，需要传入 `this` 指针（这是 C 而非 C++）：

```c
SystemTable->ConOut->ClearScreen(SystemTable->ConOut);
SystemTable->ConOut->OutputString(SystemTable->ConOut, L"Hello, world!");
```

完整代码：

```c title="src/booloader.c"
#include <efi.h>
#include <efiapi.h>

EFI_STATUS EFIAPI 
efi_main(EFI_HANDLE ImageHandle, EFI_SYSTEM_TABLE *SystemTable){
    SystemTable->ConOut->ClearScreen(SystemTable->ConOut);
    SystemTable->ConOut->OutputString(SystemTable->ConOut, L"Hello, world!");
    while(1) __asm__ volatile ("hlt");
}
```

## 运行

### 编译 链接

由于 efi 的特殊性，要写一大堆参数，用 Makefile 就更方便了。

```makefile
CLANG = clang
LLD = lld-link
CFLAGS = -I./inc -target x86_64-pc-win32-coff -ffreestanding -fno-stack-protector -mno-red-zone -Wall -Wextra
LDFLAGS = /subsystem:efi_application /entry:efi_main /out:build/BOOTX64.EFI

SRC_DIR = src
BUILD_DIR = build

$(BUILD_DIR)/BOOTX64.EFI: $(BUILD_DIR)/bootloader.obj
    $(LLD) $(LDFLAGS) $(BUILD_DIR)/bootloader.obj

$(BUILD_DIR)/bootloader.obj: $(SRC_DIR)/bootloader.c | $(BUILD_DIR)
    $(CLANG) $(CFLAGS) -c $< -o $@

$(BUILD_DIR):
    mkdir -p $(BUILD_DIR)
```

### 装盘

esp 必须是 FAT 格式的，入口放在 `/EFI/BOOT/BOOTX64.EFI` 处。

```makefile
$(BUILD_DIR)/esp.img: $(BUILD_DIR)/BOOTX64.EFI
    dd if=/dev/zero of=$(BUILD_DIR)/esp.img bs=1M count=64
    mkfs.vfat $(BUILD_DIR)/esp.img
    mmd -i $(BUILD_DIR)/esp.img ::/EFI
    mmd -i $(BUILD_DIR)/esp.img ::/EFI/BOOT
    mcopy -i $(BUILD_DIR)/esp.img $(BUILD_DIR)/BOOTX64.EFI ::/EFI/BOOT/
```

### 启动 QEMU

```makefile
run: $(BUILD_DIR)/esp.img
    qemu-system-x86_64 -bios OVMF.fd -drive format=raw,file=$(BUILD_DIR)/esp.img
```

### 所有系统全部启动启动启动启动

```sh
make run
```

不出意外的话，你可以在 QEMU 上看到一句 `Hello, world!`
