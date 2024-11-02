---
title: Solution
createTime: 2024/10/18
categories:
    - study
tags:
    - maths
---

已知 $f(x+y)=f(x)f(yf(x))$，求 $f(x)$

---

$$

\begin{align*}

f'(x) &= \lim_{y\to 0} {f(x+y)-f(x) \over y}
\\
&= \lim_{y\to 0} {f(x)f(yf(x))-f(x) \over y}
\\
&= f(x) \lim_{y\to 0} {f(yf(x))-1 \over y}
\\
&= f(x) \lim_{y\to 0} {\left[f'(yf(x))f(x)\right]} （{0\over 0}型洛必达，上下同时对y求导）
\\
&= af^2(x)
\\
\\
记~~z&=f(x)，则
\\
{\mathrm{d}z \over \mathrm{d}x}&=az^2
\\
{\mathrm{d}z \over z^2}&=a\mathrm{d}x ~或~ z=0
\\
\int {\mathrm{d}z \over z^2}&=\int a\mathrm{d}x ~或~ z=0
\\
-{1\over z}&=ax+C ~或~ z=0
\\
故~~f(x)&={1\over kx+b} ~或~ f(x)=0
\\
\\
由~~f(0+&0)=f(0)f(0f(0))
\\
f(0)&=0或1
\\
故~~f(x)&={1\over kx+1} ~或~ f(x)=0，代入检验可知答案正确。
\\

\end{align*}
$$

---

注：原题有 $x, y \in \mathrm{R_+}$ 限制，不过大同小异。
