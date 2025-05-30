---
title: LaTeX 效果
createTime: 2025/1/24
---

## 效果

原整理于洛谷，2025/3/25 移植。

$$
\begin{gather*}
{\color{#CF6}\Huge\bigcirc}\kern{-33px}
\color{#9D3}
\stackrel{\tiny\text{Adventure Rank}}{\Large 65}
\\
\stackrel{\scriptsize\tt 295229520 \mathop{/} 332133210}
{\scriptsize\color{#888}\diamond\ \ 
\color{#CF6}\rule{80px}{3px}\color{#CCC}\rule{10px}{3px}\ 
\color{#888}\diamond}
\\
\small\tt\color{#999}Adventure\ EXP+\!998244353
\end{gather*}
$$

:::tip
- 在 KaTeX 中，`\kern` 的参数为 `-33px`.
- 在 MathJax 中，`\kern` 的参数为 `-50px`.
:::

$$
\begin{array}{c|c}
\hline
\text{text} & \text{math / 文字效果}
\\\hline
\textrm{rm} & \mathrm{
	1234567890abcxyz}
\\\hline
\textbf{bf} & \mathbf{
	1234567890abcxyz}
\\\hline
\texttt{tt} & \mathtt{
	1234567890abcxyz}
\\\hline
\textsf{sf} &\mathsf{
	1234567890abcxyz}
\\\hline
\textit{it} &\mathit{
	1234567890abcxyz}
\\\hline

\end{array}
$$

$$
\begin{array}{l|l}
\hline
\texttt{\textbackslash kern\{2em\}} & 1\kern{2em}2
\\\hline
\texttt{\textbackslash kern\{-10px\}} & 1\kern{-10px}2
\\\hline
\texttt{\textbackslash hphantom\{666\}} & \substack{\normalsize 1\hphantom{666}2 \\ \normalsize 16662}
\\\hline
\end{array}
$$

$$
\begin{array}{l|c}
\texttt{\textbackslash stackrel\{1\}\{2\}} & \stackrel{1}{2}
\\\hline
\texttt{\textbackslash stackrel\{\textbackslash large\{1\}\}\{2\}} & \stackrel{\large{1}}{2}
\\\hline
\texttt{\textbackslash substack\{1 \textbackslash \textbackslash 2}\} & \Large\substack{1 \\ 2}
\end{array}
$$

text style: $\textstyle \sum_i\frac{1}{2}$

display style: $\displaystyle \sum_i\frac{1}{2}$

`\dfrac`: $\dfrac{1}{2}$

*行内使用 display style 如果不新建段落的话可能会和相邻行重叠

## 宏包

!!我大费周章把 KaTeX 换成 MathJax 就是为了这个口牙！!!

!!upd: 发现 KaTeX 有打开 mhchem 的设置，成小丑了!!

### 各种箭头

:::demo markdown
```md
$$
\begin{gather*}
\texttt{amsmath} & \xrightarrow[below]{above} \quad
\xlongequal{text} \quad
\xtwoheadrightarrow{text}
\\
\texttt{extpfeil} & \xrightleftharpoons[below]{above}
\end{gather*}
$$
```
:::

### 化学方程式

:::demo markdown
```md
$$
\begin{gather*}
\ce{Cu + SO4^2-(\text{浓}) + 4H+ ->[\Delta] Cu^2+ + SO2 ^ + 2H2O}
\\
\ce{C2H5OH + CH3COOH <=>[\text{浓}H2SO4][\Delta] CH3COOC2H5 + H2O}
\\
\ce{<=>>} \quad \ce{<<=>}
\\
\ce{CuSO4*5H2O}
\end{gather*}
$$
```
:::
