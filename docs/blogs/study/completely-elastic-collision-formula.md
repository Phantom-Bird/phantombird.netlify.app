---
title: 完全弹性碰撞公式记忆方法
createTime: 2025/7/3
categories:
    - study
tags:
    - physics
---

我们把弹性碰撞过程看成一个物体的速度“影响”另一个物体的速度。（由于历史遗留问题，下称“矫正”）

我们引入一个矫正速度 $u$，$u_1$ 可以看作物体 1 对物体 2 速度的“矫正”。由于一些“矫枉过正”的因素，$u_1=2v_1-v_2$, $u_2=2v_2-v_1$，也就是“二倍自己减去别人”，可以由”质量相等，速度交换的法则理解。
我们引入一个矫正速度 $u$，$u_1$ 可以看作物体 1 对物体 2 速度的“矫正”。由于一些“矫枉过正”的因素，$u_1=2v_1-v_2$, $u_2=2v_2-v_1$，也就是“二倍自己减去别人”，可以由“质量相等，速度交换”的法则理解。

然后末速度就可以看成一个简单的加权平均，$v_1'=\dfrac{m_1v_1+m_2u_2}{m_1+m_2}, v_2'=\dfrac{m_1u_1+m_2v_2}{m_1+m_2}$，自己的质量配自己的速度，另一个的质量配另一个的矫正速度。

完整版的：

$$
\begin{cases}
u_\text{s} = 2v_\text{s} - v_\text{o}
& \qquad\color{red}\text{s: self}
\\
v_\text{s}' = \dfrac{m_\text{s}v_\text{s} + m_\text{o}u_\text{o}}
{m_\text{s} + m_\text{o}}
& \qquad\color{red}\text{o: the other}
\end{cases}
$$
