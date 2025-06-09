---
title: 操作系统(1) - 环境搭建
createTime: 2025/6/7
---

> 工欲善其事，必先利其器。

花了一天时间踩坑，终于摸索出了最省事的解决方案。

## WSL

正在使用 Linux 或已有 WSL 的可以跳过。

1. 在 BIOS 打开虚拟化
2. 在**启用或关闭 Windows 功能**打开虚拟化和 WSL
3. 重启
4. 在 Powershell **(管理员)** 输入：

    ```powershell
    wsl --install
    ```

5. 只需等待

## 包安装

以 apt 包管理器为例：

为了提高下载速度，可以先换源。

```sh
sudo apt update
sudo apt install \
    build-essential nasm clang lld \
    qemu-system-x86 ovmf \
    gnu-efi \
    dosfstools mtools
```

只需等待。

## 头文件

直接把 gnu-efi 的源代码下载下来，然后把 inc 文件夹复制到项目里即可。

如果 IDE 支持，记得把 `inc/` 加进 include path 里面。

现在你是否有写个 Hello, world 的热情？下一章再说吧，这里空白太小，写不下。
