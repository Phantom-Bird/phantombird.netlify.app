---
title: 操作系统(9) - 处理中断
createTime: 2025/6/29
---

:::note 定义

中断‌是计算机系统中一种由硬件或软件发出的信号，用于请求处理器暂停当前任务并处理特定事件。中断允许CPU在执行指令流时被紧急事件打断，从而实现异步事件响应、提高CPU利用率、协调硬件与软件交互‌。  
常用于：键盘输入响应‌‌、定时器触发、‌硬件异常处理、‌系统调用。

:::

## 加载 IDT

要注册中断处理程序，就要填 IDT（中断描述符表）。  
每一项的结构如下：

```c title="src/kernel/idt.h"
typedef struct __attribute__((packed)) {
    uint16_t offset_low;        // bits 0..15
    uint16_t selector;          // 代码段选择子
    uint8_t  ist;               // 低三位为中断栈表索引（0）

    uint8_t  type       : 4;    // 门类型 (0xE=中断门, 0xF=陷阱门)
    uint8_t  ignored    : 1;
    uint8_t  dpl        : 2;    // 描述符特权级
    uint8_t  present    : 1;

    uint16_t offset_mid;        // bits 16..31
    uint32_t offset_high;       // bits 32..63
    uint32_t reserved;
} IDTDescriptor;
```

写个填表辅助函数：

```c title="src/kernel/idt.c"
IDTDescriptor idt[256];

void set_idt_entry(int vec, void (*handler)(), uint16_t selector, uint8_t type, uint8_t dpl) {
    uint64_t addr = (uint64_t)handler;
    idt[vec].offset_low  = addr & 0xFFFF;
    idt[vec].selector    = selector;
    idt[vec].ist         = 0;
    idt[vec].type        = type;
    idt[vec].dpl         = dpl;
    idt[vec].present     = 1;
    idt[vec].offset_mid  = (addr >> 16) & 0xFFFF;
    idt[vec].offset_high = (addr >> 32) & 0xFFFFFFFF;
    idt[vec].reserved    = 0;
}
```

接下来，使用 `lidt` 命令加载 IDT：

```c title="src/kernel/idt.h"
typedef struct {
    uint16_t limit;
    uint64_t base;
} IDTPtr;
```

```c title="src/kernel/idt.c"
void lidt(void* base, uint16_t size) {
    IDTPointer idtr = {
        .limit = size,
        .base = (uint64_t)base
    };
    __asm__ volatile ("lidt %0" : : "m"(idtr));
}
```

## 中断处理函数

现在，我们来注册一个中断处理函数吧。中断处理一般拆成两个函数。一个使用汇编保存现场，另一个是真正的处理函数。

```c title="src/kernel/idt.c"
void __isr80(){
    print("[KERNEL] Hello from int 0x80!\n");
}

__attribute__((naked)) void isr80() {
    // 裸函数，编译器不生成额外的代码
    __asm__ volatile (
        PUSH_ALL_REGISTERS  // 保存现场
        "call __isr80;"
        POP_ALL_REGISTERS  // 需要精确反向对应，不然会炸
        "iretq;"
    );
}

void init_idt() {
    set_idt_entry(0x80, isr80, 0x08, 0xE, 0);
    lidt(idt, sizeof(idt) - 1);
}
```

## 测试

```c title="src/kernel/idt.c"
print("[KERNEL] Initializing IDT...\n");
init_idt();

__asm__ volatile ("sti");
__asm__ volatile ("int $0x80");
```

你就可以看到中断对你的问好。

## 集中处理

我们把所有的中断都集中到一个函数里面，方便处理。

```c title="src/kernel/isr.c"
#include "print.h"
#include "isr.h"

void isr(int vec, void* const saved_registers){
    print("[KERNEL] int ");
    print_hex(vec);
    print(", saved registers at ");
    print_hex((uint64_t) saved_registers);
    putchar('\n');
}

#define ISR(vec)                                \
    __attribute__((naked)) void isr##vec() {    \
        __asm__ volatile (                      \
            PUSH_ALL_REGISTERS                  \  // 保存现场
            "mov $" #vec ", %rdi;"              \  // 第一个参数
            "mov %rsp, %rsi;"                   \  // 第二个参数
            "call isr;"                         \
            POP_ALL_REGISTERS                   \  // 恢复现场
            "iretq;"                            \
        );                                      \
    }

MACRO_FOR_256(ISR)
```

接下来，我们批量注册它们：

```cpp title="src/kernel/idt.c"
uint8_t get_type(int v){
    return (v==1 || v==3 || v==4 || v>=0x80)? 0xF: 0xE;
}

uint8_t get_dpl(int v){
    return (v >= 0x80)? 3: 0;
}

#define INIT_ISR(vec) set_idt_entry(vec, isr##vec, 0x08, get_type(vec), get_dpl(vec));
void init_idt() {
    MACRO_FOR_256(INIT_ISR)
    lidt(idt, sizeof(idt) - 1);
}
```

其中，`MACRO_FOR_256` 的画风大概是这样的：

```c title="src/kernel/marco_for.h"
#define MACRO_FOR_256(MACRO) MACRO(0) MACRO(1) ... MACRO(255)
```

## 每日 Hello

你可以手动多触发几个中断。

```c title="src/kernel/kernel.c"
__asm__ volatile ("int $0x80, int $0xFF");
```
