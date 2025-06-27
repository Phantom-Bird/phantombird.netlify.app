---
title: 对 GooodPig 连续有趣集合的构造性证明
createTime: 2025/5/26
categories:
    - study
tags:
    - maths
---

:::note 题意

若 $\forall k \in \{L, \dots, R\}, \sum_{a \in A} k \bmod a = k, \max A < L$，证明 $R-L$ 可以任意大.

:::

作差，

$$
\begin{align*}

i+1-i &= \sum_{a \in A} (i+1) \bmod a - \sum_{a \in A} i \bmod a \\
&= \sum_{a \in A} 1 - a[a \mid i+1] \\
&= n - \sum_{\substack{a \in A \\ a \mid i+1}} a
\quad
\end{align*}
$$

于是有 $\displaystyle\sum_{\substack{a \in A \\ a \mid i}} a = n-1 \ (i=L+1, \dots, R)$.

一个显而易见的事实是：如果 $A$ 既满足差分约束，又对 $L$ 有趣，由数学归纳法，原命题自动成立. 于是我们想办法满足差分约束.

令 $T_i = \{a\in A \mid a|L+i\}$. 不妨令 $a \ge R-L$，则 $T_i$ 互斥.

:::note 引理

对于任意 $u\in\mathbb{N^*}$，总存在集合列 $\{S_i\}\ (i=1, 2, \dots, u)$ 使得 $\forall a\in S_i, b\in S_j, i \ne j, \gcd(a, b) = 1$ 且 $\operatorname{sum} S_i = \mathrm{C}$.

**证明** 引入辅助质数数列 $p_i$，令 $P = \prod_i p_i$，不难发现 $S_i = \{p_i, P - p_i\}$ 符号合条件.

:::

:::note 引理

若 $a_1, a_2, \dots, a_u$ 两两互质，总存在无数组整数 $k_1, k_2, \dots, k_u$，使得 $\{k_i a_i\}$ 为公差为 $1$ 的等差数列.

**证明** 由 $k_{i} = \dfrac{i-1+k_1 a_1}{a_i} \in \mathbb{N^*}$ 可以得到同余方程组 $k_1 \equiv (1-i) a_1^{-1} \pmod{a_i}$，由中国剩余定理，方程组总是有无数组解.

:::

由上，令 $T_i = \{p_i, P-p_i\}$，$L, \dots, R$ 为 $\{P-p_i\}$ 通过引理 2 生成的等差数列，不难验证此构造满足差分约束.

此时，$A = \{p_1, P-p_1, p_2, P-p_2, \dots, p_{R-L}, P-p_{R-L}, b_1, b_2, \dots, b_{P+1-2(R-L)}\}$，且 $b_i \nmid L, \dots, R$.

令 $M_\text{rest} = L - \left(\displaystyle\sum_{i=1}^{R-L} L \bmod p_i + L \bmod (P-p_i) \right)$，因为 $L$ 可以任意大，总存在 $M_\text{rest} > 0$.

设 $M_\text{rest} = m_1 + m_2 + \cdots + m_{P+1-2(R-L)}$，由于 $L$ 可以任意大，且 $M_\text{rest} < L$，总是存在一种分解使得 $m_i < \dfrac{L - (R-L)}{2}$.

于是，令 $b_i = L - s_i$ 即可，根据以上的不等式，不难得出 $L \bmod b_i = m_i$ 以及 $b_i \nmid L, \dots, R$.

$\square$
