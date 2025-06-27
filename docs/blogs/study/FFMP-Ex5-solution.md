---
title: 题解：拾起砂糖的祭典（FFMP Ex5 20250313）
createTime: 2025/3/13
categories:
    - study
tags:
    - math
---

用被删去的顺序给集合中的每一个元素编号，以下简便起见，将用标号指代对应的元素。

想象一个表格，第 $x$ 行第 $y$ 列是 $f(x,y)$，满足 $z=f(x, y)$，在删去 $\{1, \cdots, k\}$ 后，表格只剩下右下角处 $(n-k) \times (n-k)$ 的子表。该子表的单元格一定满足 $f(x, y) \notin \{1, \cdots, k\}$. 

于是，我们可以知道 $f(x, y) > \min(x, y)$. 删去顺序确定的情况下，$f(x, y)$ 的数量为

$$\prod_{1 \le x, y \le n} \min(x, y) = \prod_{1 \le k \le n} k^{2k-1}$$

由于被删去的顺序一共有 $n!$ 种，我们有（注意：由于一个 $f$ 可以对应多种删除顺序，所以只能小于等于）

$$
N \le n!\prod_{1 \le k \le n} k^{2k-1} = \displaystyle\prod_{k=1}^{n} k^{2k} \\
$$

于是

$$
p \le \dfrac{\displaystyle\prod_{k=1}^{n} k^{2k}}{n^{n^2}} 
$$

---
接下来来一把对数+差分宇宙：

$$
\begin{gather*} 
\ln p - \left(1-\frac{n}{2}\right) \le \left(\sum_{k=1}^n 2k\ln k \right) - n^2\ln n - \left(1-\frac{n}{2}\right) = s_n\\
s_k - s_{k-1} = 2k\ln k - k^2\ln k + (k-1)^2\ln (k-1) + \frac{1}{2}
 \end{gather*}
$$

---
勇敢去导，我的朋友！

$$
\begin{aligned}
\text{设 } f(k) &= 2k\ln k-k^{2}\ln k+(k-1)^{2}\ln(k-1)+\frac{1}{2} \\
f'(k) &= 1+2(k-1)\ln(k-1)-2(k-1)\ln k \\
f''(k) &= 2\left(\frac{1}{k}+\ln\left(1-\frac{1}{k}\right)\right) < 0 \\
\text{由 } f'(2) &= 1-2\ln2 = \ln\frac{e}{4} < 0 \\
\therefore k \ge 2 &\text{ 时}, f'(2) < 0 \\
\text{由 } f(3) &= 6\ln3-9\ln3+2\ln4+\frac{1}{2} \\
&= \frac{1}{2}\ln\left(\frac{2^{8}e}{3^{6}}\right) \\
\text{显然 } & \frac{3^6}{2^8} > 2.8 > e, \text{于是 } f(3)<0. \\
\therefore n \ge 3 & \text{ 时，} f(k) < 0.
\end{aligned}
$$

---

$$
\begin{gather*} 
\text{根据 } \frac{1^1}{1^{1^2}}=1<e^{3/2}, \frac{1^1 \times 2^2}{2^{2^2}}=\frac{1}{2} < e, \\
n=1, n=2 \text{ 符合条件.}
\\
\text{由 } s_k - s_{k-1} < 0, \text{以数学归纳法即证。} \square
 \end{gather*}
$$
