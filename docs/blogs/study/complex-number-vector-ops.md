---
title: 用复数运算表示向量运算的尝试
createTime: 2025/3/21
categories: 
    - study
tags:
    - maths
---

:::tip 命名约定

$a, b, c \in \mathbb{C}, \mathbf{a}=(\mathbf{Re}(a), \mathbf{Im}(a)), a^*=\bar{a}, \alpha=\arg a$.

:::

## 分解 I

$\mathbf{Re}(z) = \dfrac{z+z^*}{2}$

$\mathbf{Im}(z) = \dfrac{z-z^*}{2\mathrm{i}}$

## 点积

$$
\begin{aligned}
(z_1+z_2)(z_1^*+z_2^*) &= (\mathbf{z_1}+\mathbf{z_2})^2
\\
z_1z_1^*+z_2z_2^*+z_1z_2^*+z_1^*z_2 &= \mathbf{z_1}^2+\mathbf{z_2}^2+2\mathbf{z_1}\cdot\mathbf{z_2}
\\
\mathbf{z_1}\cdot\mathbf{z_2} &= \frac{z_1z_2^*+z_1^*z_2}{2}
\end{aligned}
$$

当然也有 $\mathbf{z_1}\cdot\mathbf{z_2} = \mathbf{Re}(z_1^*z_2) = \mathbf{Re}(z_2^*z_1)$.

另一种优雅的证明方法见下。

## 叉积

将二维叉积定义为 $\mathbf{a}\times\mathbf{b}=\det(\mathbf{a}, \mathbf{b})$.

$$\mathbf{z_1}\times\mathbf{z_2} = \frac{z_1z_2^* - z_1^*z_2}{2} = \mathbf{Im}(z_1^*z_2) = -\mathbf{Im}(z_2^*z_1)$$

**证明** $a^*b=|a|e^{-i\alpha}|b|e^{i\beta}=|a||b|e^{i(\beta-\alpha)}=|a||b|\cos(\beta-\alpha)+i|a||b|\sin(\beta-\alpha)=\mathbf{a}\cdot\mathbf{b}+\mathrm{i}\mathbf{a}\times\mathbf{b}$

## 线性变换

可以由点积表示。

$$\left[ \begin{matrix}\mathbf{a}\\\mathbf{b}\end{matrix} \right] ~ \mathbf{c} = \left[ \begin{matrix}\mathbf{a}\cdot\mathbf{c} \\ \mathbf{b}\cdot\mathbf{c}\end{matrix} \right]$$

## 分解 II

$\mathbf{i}$ 易混淆，我们用 $\mathbf{u}, \mathbf{v}$ 表示基底。

设 $u=a+b\mathrm{i}, v=c+d\mathrm{i}, w=m+n\mathrm{i}$.

若 $w=xu+yv$，则有

$$
\begin{cases}
    ax+cy=m \\
    bx+dy=n
\end{cases}
$$

由克莱默法则

$$
\begin{cases}
    x = \frac{\begin{vmatrix} m&c\\n&d \end{vmatrix}}
    {\begin{vmatrix} a&c\\b&d \end{vmatrix}}
    = \dfrac{\mathbf{w}\times\mathbf{v}}{\mathbf{u}\times\mathbf{v}}
    \\
    y = \frac{\begin{vmatrix} a&m\\b&n \end{vmatrix}}
    {\begin{vmatrix} a&c\\b&d \end{vmatrix}}
    = \dfrac{\mathbf{u}\times\mathbf{w}}{\mathbf{u}\times\mathbf{v}}
\end{cases}
$$

$$x+yi = \frac{\mathbf{Im}(w^*v) + i\mathbf{Im}(u^*w)}{\mathbf{Im}(u^*v)}$$

$$x+yi = \frac{w^*v-wv^* + i(u^*w-uw^*)}{u^*v-uv^*}$$

## Ex：走近新定义

$$
a*b \mathop{=}\limits^\triangle a^*b
$$

$$
\begin{aligned}
a*b=(b*a)^* &~~~~\text{（共轭交换律）} \\
(a*b)*c=a^* *(b*c) &~~~~\text{（共轭结合律，即左乘左外共轭律）}\\
a*(b*c) = b*(a*c) &~~~~\text{（左乘右外互通律）}\\
a*(b*c) = (a^* *b) * c &~~~~\text{（左乘左外共轭律）}\\
(a*b)*c = b*(a^* *c) = b*(ac) &~~~~\text{（左乘左右共轭律）}\\
a(b*c) = b*(ac)=(a*b)*c &~~~~\text{（左乘右外互通律/跨运算结合律）}\\
a(b*c) = (a^* b) * c &~~~~\text{（左乘左外共轭律）}\\
(ab)*c = b*(a^*c) &~~~~\text{（左乘左右共轭律/跨运算结合律）}\\
(a \pm b)*c = a*c \pm b*c &~~~~\text{（右分配律）}\\
a*(b \pm c) = a*b \pm a*c &~~~~\text{（左分配律）}\\
a^{-1} = \frac{1}{a^*} &~~~~\text{（单位圆反演逆元）}\\
aa^{-1}=a^{-1}a=1 &~~~~\text{（左右逆元相等）}\\
\begin{aligned}
a*a=|a|^2 \\
a*(a\mathrm{i})=|a|^2\mathrm{i}
\end{aligned} &~~~~\text{（模长平方）}
\end{aligned}
$$
