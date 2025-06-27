---
title: Meet in the Middle
createTime: 2025/6/21
categories:
    - IT
tags:
    - OI
    - OI-note
---

可以用来处理数据范围是爆搜范围的两倍以下的可拆分问题。

## 例 1：[P4799 [CEOI 2015] 世界冰球锦标赛 (Day2)](https://www.luogu.com.cn/problem/P4799)

乍一看像背包，但是值域 $2^N$ 太大了，背包还不如 $O(2^N)$ 的爆搜。

如果 $N$ 再小一点，就可以爆搜了。

于是引出了主题：把原序列拆成两半 $S, T$，爆搜 $O(2^{N/2})$，由于折半，变得可以接受了。

分别暴力出不同价格对应的方案数集合。然后，我们发现可以用这两个集合通过双指针（或者偷懒用 STL 二分查找）得出答案。

经过折半 + 合并的过程，时间复杂度就完成了 $O(2^N) \longrightarrow O(N \cdot 2^{N/2})$ 的蜕变。

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=50;
int n, m;
int a[maxn];
vector<int> sl, sr;

void dfs(int l, int r, int id, int sum, vector<int> &out){
    if (sum > m){
        return;  // 其实影响不大。
    }
    
    if (id > r){
        out.push_back(sum);
        return;
    }
    
    dfs(l, r, id+1, sum, out);
    dfs(l, r, id+1, sum + a[id], out);
}

signed main(){
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    cin >> n >> m;
    for (int i=1; i<=n; i++){
        cin >> a[i];
    }
    
    int mid = n/2;
    dfs(1, mid, 1, 0, sl);
    dfs(mid+1, n, mid+1, 0, sr);
    
    sort(sl.begin(), sl.end());
    sort(sr.begin(), sr.end());
    
    int ans = 0;
    for (int suml: sl){
        int maxr = m - suml;
        ans += upper_bound(sr.begin(), sr.end(), maxr) - sr.begin();
    }
    
    cout << ans;
    
    return 0;
}
```

这里直接朴素地存下搜索结果即可，如无必要，勿增实体。

如果对 `upper_bound` 一句有疑问，见：

```text
i  0 1 2 3 4 5
sr 1 2 2 2 3 4
   [  4  ] ^upper_bound
```

:::tip 如果你担心找到 end 的情况

直接查找等价于插入一个 $+\infty$ 再查找，而后者的 $+\infty$ 显然不会影响连续性.

也就是说，`end` 和正常情况没什么两样. 如果不放心可以自己画一下图.

:::

## 例2（特殊去重）：[P3067 [USACO12OPEN] Balanced Cow Subsets G](https://www.luogu.com.cn/problem/P3067?contestId=252170)

要求 $(\sum A) = (\sum B)$，处理这种等式的常用手法是作差，$s = (\sum A) - (\sum B) = 0$.

一个元素对 $s$ 的贡献一定属于 $\{0, 1, -1\}$，于是可以分两段 $O(3^{n/2})$ 爆搜这个和。

不过这种方法存在重复。因此，我们需要对一种集合的不同分割方式进行去重。将集合状压后装入 `unordered_map` 即可。

由于去重的关系，最后合并答案只能使用暴力。但是由于操作的是集合，时间复杂度是 $O(2^n)$，刚好足够通过此题。

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=30;
int a[maxn];

typedef unordered_map<int, unordered_set<int>> mis;
mis statel, stater;
unordered_set<int> ans;

void dfs(int l, int r, int id, int sum, int state, mis &out){
    if (id > r){
        out[sum].insert(state);
        return;
    }
    
    dfs(l, r, id+1, sum,        state,          out);
    dfs(l, r, id+1, sum+a[id],  state|(1<<id),  out);
    dfs(l, r, id+1, sum-a[id],  state|(1<<id),  out);
}


signed main(){
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    int n;
    cin >> n;
    for (int i=1; i<=n; i++){
        cin >> a[i];
    }
    
    int mid = n/2;
    dfs(1, mid, 1, 0, 0, statel);
    dfs(mid+1, n, mid+1, 0, 0, stater);
    
    for (auto [suml, vl]: statel){
        for (int l: vl){
            for (int r: stater[-suml]){
                if (l | r){  // 去掉空集
                    ans.insert(l | r);
                }
            }
        }
    }
    
    cout << ans.size();
    
    return 0;
}
```

## 例 3（特殊合并）：[P10884 [COCI 2017/2018 #2] San](https://www.luogu.com.cn/problem/P10884)

之前的写法都是用一样的写法找两边，之后再合并. 现在介绍一种正统、适应性更强的做法. 就是左右分开，右边找到之后立刻更新答案.

因为要求子序列非严格单调递增，需要记录下截断处 $\mathrm{end}_i$ 和收益 $s_i$.

假设右边找到了路径 $(S, H)$，若可以和左半边的第 $i$ 条记录合并，则要求

$$
\begin{cases}
s_i \ge K - S \\
h_\mathrm{end_i} \le H \\
\end{cases}
$$

由于 $\mathrm{end}$ 这一维值域极小 $(\le 20)$，我们可以直接穷举.

于是，把所有 $s_i$ 存到以 $\mathrm{end}_i$ 为键的表中，直接二分即可.

> 碎碎念：
>
> 原来想的是离线二维数点，然后发现还有更简单的方法.  
> 之前认为这种方法开销大，但是最后发现它不仅开销甚至还小，而且更简单.
> 这就是返璞归真的力量 // ?

此算法的时间复杂度为 $O(2^{N/2} N)$，各项复杂度如下：

| 项目 | 时间复杂度 |
| --- | --- |
| 搜索 | $O(2^{N/2})$ |
| 排序 | $O(2^{N/2} N)$ |
| 合并 | $O(N^3)$ |

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=40;
int n, k, mid;
int h[maxn+10], g[maxn+10];
int ans;
vector<int> lans[maxn];

void dfsl(int id, int pre, int sum){
    if (id == mid + 1){
//        printf("left s=%d, end=%d\n", sum, pre);
        lans[pre].push_back(sum);
        return;
    }
    
    dfsl(id+1, pre, sum);
    if (h[id] >= h[pre]){
        dfsl(id+1, id, sum + g[id]);
    }
}

void proc(int H, int S);

void dfsr(int id, int pre, int sum) {
    // 反着找
    if (id == mid){
        proc(h[pre], sum);
        return;
    }
    
    dfsr(id-1, pre, sum);
    if (h[id] <= h[pre]){
        dfsr(id-1, id, sum + g[id]);
    }
}

void proc(int H, int S){
//    printf("right s=%d, start.H=%d\n", S, H);
    for (int ed=0; ed<=mid; ed++){
        if (h[ed] <= H){
            int lb = lower_bound(lans[ed].begin(), lans[ed].end(), k-S) - lans[ed].begin();
            // e.g. K-S = 5, size=7
            // i 0 1 2 3 4 5 6
            // s 1 3 5 5 6 7 9
            //     lb^
            //       [ 7-2=5 ]
            ans += lans[ed].size() - lb;
        }
    }
}


signed main(){
    ios::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    
    cin >> n >> k;
    for (int i=1; i<=n; i++){
        cin >> h[i] >> g[i];
    }
    
    mid = n/2;
    
    dfsl(1, 0, 0);
    
    for (int i=0; i<=mid; i++){
        sort(lans[i].begin(), lans[i].end());
    }
    
    h[n+1] = 0x3f3f3f3f3f3f3f3f;  // 填充 pre，且可处理 empty_path 
    dfsr(n, n+1, 0);

    cout << ans;
    
    return 0;
}
```
