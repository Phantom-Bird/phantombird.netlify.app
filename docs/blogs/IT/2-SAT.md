---
title: 有向 2-SAT
createTime: 2025/5/12
categories:
    - IT
tags:
    - OI
    - OI-note
---

## 类型

有数组 $\texttt{bool a[N]}$，给定 $m$ 个约束条件 $a_x=p \longrightarrow  a_y=q$。

## 解法

仿照 [无向 2-SAT](undirected-2-sat.md)：

我们引入一个概念“命题”，命题“$a_x=b$”简记为 $(x,b)$，所有命题组成了图上的点。

接下来，对于每个约束 $P \rightarrow Q$，将 $P \rightarrow Q, \neg Q \rightarrow \neg P$ 连边，成为一个有向图。

对于 $(x,0)$ 和 $(x,1)$，有如下可能的关系：

1. $a_x=0 \longleftrightarrow a_x=1$  
   无解。可以用强连通缩点判断。
2. $a_x=p \longrightarrow a_x=\neg p$  
   解为 $a_x=\neg p$，可以用缩点后的拓扑序判断。
3. 不连通  
   任选一个。

:::note 引理

Tarjan 算法所求的强连通分量的顺序是缩点图的一个拓扑序的反序。

:::

用缩点图的 dfs 返回序什么的，懒得证了。

总之，建完图 tarjan 缩点，然后对于每对虚点，选强连通分量的顺序最小的一个，如果相等则无解。
