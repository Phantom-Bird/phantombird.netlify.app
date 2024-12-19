---
title: 莫队
createTime: 2024/12/15
---

## 普通莫队

对于有些区间问题，数据结构难以维护，但是若已知 $\operatorname{ans}(l, r)$，可以很快地求出 $\operatorname{ans}(l \plusmn1, r)$ 与 $\operatorname{ans}(l, r \plusmn1)$，即可以很快地在询问区间中增删一个数，我们容易想到求出 $\operatorname{ans}(l_i, r_i)$ 之后，通过一步一步挪动 $l, r$ 得到 $\operatorname{ans}(l_{i+1}, r_{i+1})$。

为了使挪动次数尽可能小，莫队提出：设块长为 $B$，$\operatorname{block}(x)=\left\lfloor \frac{x}{B} \right\rfloor$，可以对询问以 $[\operatorname{block}(l), r]$ 为关键字排序。$B=\frac{n}{\sqrt{m}}$ 时，有最小复杂度 $\operatorname{O}(n\sqrt{m})$。

:::tip 封装
可以将从询问范围中增删数封装为一对互逆的函数 `add` 和 `del`，函数的参数有下标/值两种写法，为了兼容性，我们这里全都要！采用 `add(p, x)` 的写法。可以根据实际，采用不同的写法。

**在带修莫队中能更好地体现“互逆”的重要性。**
:::

:::tip 优化
一个小优化：$\operatorname{block}(l)$ 为奇/偶时把 $r$ 升/降序排列，这样可以减小挪动次数，减小常数。
:::

## 带修莫队

假如有修改呢？

考虑分版本，在询问上记录下当前询问的版本号。

记录上一个版本至此版本的更改。（如 `R[t] = {p: 3, x: 6}` 表示从版本 $t-1$ 到版本 $t$ 的更改为 $a_3 \gets 6$）

请注意，由于赋值操作不可逆，需要用 `swap(R[x].x, a[R[t].p])` 代替 `a[R[t].p] = R[t].x`。

图示：

$$
\begin{align*}
\begin{array}{c|cccc}
i & 1 & 2 & 3 & 4\\
\hline
a & 1 & 1 & 4 & 5
\end{array}
\quad&
%\ce{<=>[\footnotesize\texttt{t++; swap(R[t].x, a[R[t].p]);}][\footnotesize\texttt{swap(R[t].x, a[R[t].p]); t--;}]}
\begin{array}{c}
\texttt{t++; swap(R[t].x, a[R[t].p]);} \rightarrow\\
\hline\hline
\leftarrow\texttt{swap(R[t].x, a[R[t].p]); t--;}
\end{array}
&\quad
\begin{array}{c|cccc}
i & 1 & 2 & 3 & 4\\
\hline
a & 1 & 1 & 6 & 5
\end{array}
\\
R_2=\texttt{\{p:3, x:6\}}
&&
R_2=\texttt{\{p:3, x:4\}}
\\
\text{版本} 1, R_2 \text{记录} 1 \rightarrow 2
&&
\text{版本} 2, R_2 \text{记录} 2 \rightarrow 1
\end{align*}
$$

:::tip 封装

```cpp
void upd(int l, int r, int t){
    if (l<=R[t].p&&R[t].p<=r) {
        del(R[t].p, a[R[t].p]);
        add(R[t].p, R[t].x);
    }
    swap(R[t].x, a[R[t].p]);
}
```

即可调用 `upd(++t)` 和 `upd(t--)`。
:::

此时以 $[\operatorname{block}(l), \operatorname{block}(r), t]$ 为关键字排序，取 $B=n^{2/3}$ 时可以在 $n, m, t$ 同级时达到 $\operatorname{O}(n^{5/3})$ 的时间复杂度。
