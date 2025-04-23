---
title: 看 COCI 2020 蓝绿题
createTime: 2025/4/23
tags:
 - OI
categories:
 - IT
---

## [[COCI 2020/2021 #1] Papričice](https://www.luogu.com.cn/problem/P7165)  
  
好像是属性店铺（树形 DP）的形式，但是是皇恩店铺（换根 DP）不太可能。   
两种情况。   
  
1. 两个断点在没有祖先关系  
2. 一个断点是另一个的祖宗  

能否通过选择根规避掉 #2？(\*)  
例如重心？  
似乎可以。  
那么，$\mathrm{ans} = \max(\mathrm{siz}[i], \mathrm{siz}[j], N-\mathrm{siz}[i]-\mathrm{siz}[j])$，枚举 $i$ 然后二分权值是容易想到的方法。   
正确的。但是题解是用递归栈分类讨论(*)处问题的。  
懒得写了。   
  
## [[COCI 2020/2021 #3] Sateliti](https://www.luogu.com.cn/problem/P7170)  
  
看了题解才看得懂题，翻译背锅。  
  
每个图像都可以由原图平移 $(x,y)$ 然后坐标取模得到。  
  
如果枚举 $(x,y)$ 然后一个一个比较字典序的话，是 $O(n^4)$ 的，不能接受。考虑行状压，变为 $O(n^3)$，可以接受。  
  
## [[COCI 2020/2021 #3] Selotejp](https://www.luogu.com.cn/problem/P7171)  
  
只涉及行列整体操作，看起来像转二分图。  
最小覆盖。  
……不能覆盖关了的啊  
那没事了  
翻译再次背锅。  
注意到数据范围很小，显然状压。（靠数据范围猜复杂度是常用操作）   
网格图上状压一般只有三种：  
  
- 状压第一行，做不了。   
- 状压当前行 $O(n 2^{2m})$  
- 插头 DP $O(nm 2^m) $  
  
## [[COCI 2020/2021 #3] Vlak](https://www.luogu.com.cn/problem/P7210)  
  
有向图博弈。  
显然这个图是 Trie.  
直接算 SG，时间复杂度 $O(|c|\sum|S|)$，可以。   
好吧，没有异或，不用 SG .  
  
## [[COCI 2020/2021 #4] Vepar](https://www.luogu.com.cn/problem/P7281)  
  
阶乘分解质数的方法，虽然忘了，但是应该很快，大概 $O(n\log n)$。  
在数据范围内的质数大约有 60 万个，有点悬，但大概没有更好的方法。  
……  
  
## [[COCI 2020/2021 #4] Hop](https://www.luogu.com.cn/problem/P7282)  
  
（一阵强劲的音乐在脑海中响起）   
“每对满足 $a<b$ 的百合 $(a,b)$ 必须属于青蛙 $1,2$ 或 $3$ 中的其中一只。”  
让我们说中文。   
哦，边染色啊。   
先用整除 O(n^2) 建图。显然图为 DAG   
……  
注意不到  
看题解罢  
哦，原来是数字限制。  
那很不抽象了。   
  
妙哉。  
  
## [[COCI 2020/2021 #4] Patkice II](https://www.luogu.com.cn/problem/P7284)  
  
非常经典的 DP，设达到 $(a,b)$ 的代价为 $f(a,b)$  
显然路径不能成环，否则会无限动。因此一个点的四个方向互斥是可以保证的。  
当然，最后写出来是最短路的形式。但是我还是习惯它类最短路 DP  
  
## [[COCI 2020/2021 #5] Planine](https://www.luogu.com.cn/problem/P7401)  
  
woc，计算几何  
照亮整个山谷的光源一定在 V 字形的上端。  
显然贪心得越远越好，（当然，不能在无穷远处）  
找一条足够远的直线作为天幕，此时变为一维问题。   
  
## [[COCI 2020/2021 #5] Sjeckanje](https://www.luogu.com.cn/problem/P7402)  
  
区间修改，查询分割之后极差和的最大值。  
考虑没有修改怎么做。  
似乎与单调区间有关。   
  
不会。感觉蓝题都不咋会的亚子……  
退化力！  
  
  
  
## [[COCI 2020/2021 #6] Anagramistica](https://www.luogu.com.cn/problem/P7552)  
  
直接排序 + hashmap，然后统计相似类个数 $a_i$。小于 $2$ 的可以直接扔掉   
然后是简单的 DP.  
设前 $i$ 个相似类已经处理好，并且恰有 $j$ 对单词相似的方案数为 $f(i,j)$  
于是 $f(i,j) = \displaystyle\sum_{1\le r\le j, a_i/2} f(i-1,j-r) + \binom{a_i}{2r}$  
时间复杂度 $O(cak)=O(nk)$（c为相似类个数）   
使用滚动数组，空间 $O(ak)$
