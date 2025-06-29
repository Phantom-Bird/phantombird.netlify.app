---
title: 操作系统(8) - LGDT
createTime: 2025/6/29
---

别问为什么鸽了这么久，问就是写内核的时候踩坑太多了。现在，让我们开始吧。

## GDT

:::tip

在长模式（64 位）下，段的很多工作都由分页来代劳。但是 GDT 仍有重要的作用。例如：

1. 提供段选择子（下一节会用到）
2. 设置 TSS（任务状态段，64 位下用于处理中断、切换栈时保护现场）
3. 权限隔离

在 64 位系统中，**GDT 是不可或缺但作用被弱化的系统结构**。  
我们只需要设置好几项关键描述符，就可以满足所有现代内核的要求了。

:::

以下是 GDT 的格式：

```c title="src/kernel/gdt.h"
typedef __attribute__((packed)) {
    uint16_t limit_low;
    uint16_t base_low;
    uint8_t  base_mid;

    uint8_t  type       : 4;
    uint8_t  system     : 1;
    uint8_t  dpl        : 2;
    uint8_t  present    : 1;

    uint8_t  limit_high : 4;
    uint8_t  avl        : 1;
    uint8_t  l          : 1;
    uint8_t  db         : 1;
    uint8_t  granularity: 1;

    uint8_t  base_high;
} GDTEntry;

// __attribute__((aligned(0x1000))) GDTEntry gdt[];
```

以下，我们分别设置代码段和数据段的段描述符：

```c title="src/kernel/gdt.c"
__attribute__((aligned(0x1000))) GDTEntry gdt[3];

void init_gdt() {
    // 第 0 项固定为空
    memset(gdt, 0, sizeof GDTEntry);

    // 64位代码段描述符
    gdt[1] = (GDTEntry){
        .limit_low = 0xFFFF,
        .base_low = 0x0000,
        .base_mid = 0x00,

        .type = 0b1010,         // execute/read
        .system = 1,            // 数据/代码段
        .dpl = 0,               // 特权级
        .present = 1,

        .limit_high = 0xF,
        .avl = 0,
        .l = 1,                 // 64位
        .db = 0,                // 64位
        .granularity = 1,       // 粒度 4KB

        .base_high = 0x00,
    };

    // 64位数据段描述符
    gdt[2] = gdt[1];              // 偷懒复制
    gdt[2].type = 0b0010;         // read/write
    gdt[2].l = 0;                 // 数据段 L 位必须为 0
}
```

## 加载 GDT

```c title="src/kernel/gdt.c"
struct GDTPtr __attribute__((packed)) {
    uint16_t limit;
    uint64_t base;
} gdt_descriptor;

void init_gdt(){
    ...

    gdt_descriptor.limit = sizeof(gdt) - 1;
    gdt_descriptor.base = (uint64_t)&gdt;

    asm volatile ("lgdt %0" : : "m"(gdt_descriptor));
}
```

然后刷新段寄存器。段寄存器中存放的是段选择子。

段选择子的结构如下：

```c
typedef struct __attribute__((packed)) {
    uint16_t index  :13;    // GDT 中的索引
    uint8_t  ti     :1;     // GDT 中为 0
    uint8_t  rpl    :1;     // 特权级
} SS;
```

接下来，设置段寄存器。注意：`CS` 寄存器不能直接 `mov`，不过，`lretq` 指令可以从堆栈中取出 `CS` 和 `IP` 并跳转。

```c title="src/kernel/gdt.c"
void reload_segments() {
    __asm__ volatile (
        // 0x10 = SS{0, 0, 2}
        "mov $0x10, %%ax\n"
        "mov %%ax, %%ds\n"
        "mov %%ax, %%es\n"
        "mov %%ax, %%ss\n"
        "mov %%ax, %%fs\n"
        "mov %%ax, %%gs\n"

        // 通过 far jump 刷新 CS
        // 0x08 = SS{0, 0, 1}
        "pushq $0x08\n"
        "leaq 1f(%%rip), %%rax\n"  // 1f 即往后找第一个 1: 标签
        "pushq %%rax\n"
        "lretq\n"
        "1:\n"
        ::: "rax"
    );
}
```

接下来我们调用

```c title="src/kernel/kernel.c"
__asm__ volatile ("cli");

print("[KERNEL] Initializing IDT...\n");
init_gdt();
reload_segments();
```

即可。

好了，完成了。这一节没有 Hello，没崩溃就是成功。当然，也可以用 QEMU debug 看看寄存器。
