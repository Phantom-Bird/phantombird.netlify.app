---
title: LaTeX 效果
createTime: 2025/1/24
---

原整理于洛谷，2025/3/25 移植。

$$
{\color{#CF6}\Huge\bigcirc}\kern{-33px}
\color{#9D3}
\stackrel{\tiny\text{Adventure Rank}}{\Large 65}\\
\stackrel{\scriptsize\tt 295229520 \mathop{/} 332133210}
{\scriptsize\color{#888}\diamond\ \ 
\color{#CF6}\rule{80px}{3px}\color{#CCC}\rule{10px}{3px}\ 
\color{#888}\diamond}\\
\small\tt\color{#999}Adventure\ EXP+\!998244353
$$

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
\setminus\texttt{kern\{2em\}} & 1\kern{2em}2
\\\hline
\setminus\texttt{kern\{-10px\}} & 1\kern{-10px}2
\\\hline
\setminus\texttt{hphantom\{666\}} & {1\hphantom{666}2 ~\cdots~ 16662}
\\\hline
\end{array}
$$

$$
\begin{array}{l|c}
\setminus\texttt{\\stackrel\{1\}\{2\}} & \stackrel{1}{2}
\\\hline
\setminus\texttt{stackrel\{}{\setminus}\texttt{large\{1\}\}\{2\}} & \stackrel{\large{1}}{2}
\end{array}
$$

text style: $\textstyle \sum_i\frac{1}{2}$

display style: $\displaystyle \sum_i\frac{1}{2}$

`\dfrac`: $\dfrac{1}{2}$

*行内使用 display style 如果不新建段落的话可能会和相邻行重叠
