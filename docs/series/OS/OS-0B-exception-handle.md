---
title: 操作系统(B) - 异常处理
createTime: 2025/7/4
---

[上上回书](OS-09-IDT)说到，我们加载了 IDT。接下来，我们来写继续中断处理程序。我们先处理一个最简单的情形：异常。

## 表

我们同样用一个数组来存放函数指针，然后在 `isr_common` 调用对应的函数。和 IDT 不一样的是，我们可以毫无后顾之忧地使用 C 语言，也可以接收 `isr_common` 传递的参数了。

```c title="src/kernel/isr.h"
typedef void (*ISR)(uint8_t, void*);
extern ISR isr[256];
```

```c title="src/kernel/isr_common.c"
void isr_common(int vec, void* const saved_registers){
    if (isr[vec]){
        isr[vec](vec, saved_registers);
        return;
    }
    
    warning_color();
    print("[WARNING] Unhandled interrupt ");
    print_hex(vec);
    print(", saved registers at ");
    print_hex((uint64_t) saved_registers);
    putchar('\n');
    common_color();
}
```

## 参数解释

在这里，我们传入了一个 `saved_registers`，即在 `isr_stub` 压入的寄存器。我们不妨看看它长什么样子：

```c
typedef struct {
    uint64_t r15, r14, r13, r12, r11, r10, r9, r8;
    uint64_t rbp, rdi, rsi, rdx, rcx, rbx, rax;
    // 自动压入
    uint64_t rip, cs, rflags, rsp, ss;
} SavedRegisters;

typedef struct {
    uint64_t r15, r14, r13, r12, r11, r10, r9, r8;
    uint64_t rbp, rdi, rsi, rdx, rcx, rbx, rax;
    // 以下由 CPU 自动压入
    uint64_t err_code;
    uint64_t rip, cs, rflags, rsp, ss;
} SavedRegistersWithError;
```

:::tip
只有少数的异常才有 error code
:::

有了以上的铺垫，我们编写 ISR 的工作就简单很多了。

## 异常处理

能够熟练地阅读英语文本的人应该都看得懂。

:::details 平平无奇的代码

```c title="src/kernel/isr.c"
const char* exception_names[] = {
    "Division By Zero", "Debug", "Non Maskable Interrupt", "Breakpoint",
    "Overflow", "Bound Range Exceeded", "Invalid Opcode", "Device Not Available",
    "Double Fault", "Coprocessor Segment Overrun", "Invalid TSS", "Segment Not Present",
    "Stack-Segment Fault", "General Protection Fault", "Page Fault", "Reserved",
    "x87 Floating Point Exception", "Alignment Check", "Machine Check",
    "SIMD Floating Point Exception", "Virtualization Exception", "Control Protection Exception"
};

void handle_exception_with_err_code(uint8_t vec, SavedRegistersWithError* const regs){
    error_color();
    print("=== Exception ===\n");
    print(vec<22? exception_names[vec]: "Reserved");
    print("\nRIP: ");
    print_hex(regs->rip);
    print("\nRSP: ");
    print_hex(regs->rsp);
    print("\nERR: ");
    print_hex(regs->err_code);
    raise_err("");
}

void handle_exception_without_err_code(uint8_t vec, SavedRegisters* const regs){
    error_color();
    print("=== Exception ===\n");
    print(vec<22? exception_names[vec]: "Reserved");
    print("\nRIP: ");
    print_hex(regs->rip);
    print("\nRSP: ");
    print_hex(regs->rsp);
    raise_err("");
}

void init_isr(){
    for (int i=0; i<32; i++){
        isr[i] = (ISR)handle_exception_without_err_code;
    }
    isr[8] = isr[10] = isr[11] = isr[12] = 
             isr[13] = isr[14] = isr[17] = (ISR)handle_exception_with_err_code;
}
```

:::

我们可以通过加入

```c title="src/kernel/kernel.c"
...
init_isr();  // [!code ++]
init_idt();

volatile int x=0;  // volatile 防止编译器优化  // [!code ++]
x = 1/x;  // [!code ++]
...
```

检验异常处理。

这一章比较水，主要是因为下一章内容比较多，实在是塞不下了。
