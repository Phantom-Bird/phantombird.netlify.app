---
title: YA! 烷基计数方法
createTime: 2025/4/30
categories:
    - IT
tags:
    - OI
    - maths
    - chemistry
---

YA 是 Yet Another 口牙！

:::info **写作风格提示**

1. 我希望本文是一篇生动的博客。所以不要被它的长度吓到。本文真的很有趣。
2. 我之所以有时自称“我们”，不是因为想显得专业，也不是因为我是西方的君主，更不是因为我因为泰坦神迹变成了一千个分身，而是因为：我想和读者作为一个共同体，一起把这个问题从零解决掉。

:::

## 问题

$\mathrm{-C_n H_{2n+1}}$ （$n$ 烷基）有多少种不同的结构？

## 状态转移方程

### 前置知识

在 $n$ 个元素中选取可以重复的 $m$ 个组成可重集，方案数为 $\displaystyle\binom{n+m-1}{m}$

## 转移方程

递归讨论半键上的碳原子所连的三个烷基，可以得到递归方程：

$$
f(n)=\sum_{\substack{0\le i<j<k \le n-1 \\ i+j+k=n-1}} f(i)f(j)f(k)
+ \sum_{\substack{0\le i,j,k \le n-1 \\ i=j\ne k \\ i+j+k=n-1}} \binom{f(i)+1}{2} f(k)
+ \sum_{\substack{0\le i=j=k \le n-1 \\ i+j+k=n-1}} \binom{f(i)+2}{3}
$$

<垃圾话> 化学课一结束，Q 就跟 F 和我分享了他的公式（原始公式不是这样的，这是更简洁优雅的一种表示）。自习课（老师允许我们去打球），我们一拍即合，去小办公室借了电脑，开始写程序验证。验证通过！很显然，根据上面的方程，这个算法是 $O(n^3)$ 的，但我总觉得还有更快的算法。 </垃圾话>

## 从 O(n^3) 到 O(n^2)

### 换上下限

~~前面的式子优雅吗？我要开始爆算了。~~  
其实是先繁后简的思想啦，爆算完更优雅哦！

:::tip 注意

- 为了可读性，在之后的所有求和中，我们都默认 $0\le i,j,k \le n-1, i+j+k=n-1$.
- 你可能会看到只有一项的求和。那是为了式子的统一。
- 为了可读性，求和次序明确时，不加括号。

:::

由对称性以及容斥原理，可得
$$
\begin{aligned}

\sum_{i<j<k} f(i)f(j)f(k)
&= \frac{1}{6} \sum_{|\{i,j,k\}|=3} f(i)f(j)f(k)
\\
&= \frac{1}{6} \left( \sum_{i,j,k}-3\sum_{i=j}+2\sum_{i=j=k} \right) f(i)f(j)f(k)
\\
&= \frac{1}{6} \sum_{i,j,k} f(i)f(j)f(k)
- \frac{1}{2} \sum_{2i+k=n-1} f(i)^2f(k)
+ \frac{1}{3} \sum_{3i=n-1} f(i)^3

\end{aligned}
$$

又因为

$$
\begin{aligned}

\sum_{i=j\ne k} \binom{f(i)+1}{2} f(k)
&= \left( \sum_{i=j}-\sum_{i=j=k} \right) \binom{f(i)+1}{2} f(k)
\\
&= \sum_{2i+k=n-1} \binom{f(i)+1}{2} f(k)
- \sum_{3i=n-1} \binom{f(i)+1}{2} f(i)

\end{aligned}
$$

我们就可以把原式化为

$$
\begin{aligned}

f(n) &= \frac{1}{6} \sum_{i,j,k} f(i)f(j)f(k)
+ \sum_{2i+k=n-1} \left(
    \binom{f(i)+1}{2} f(k)
    - \frac{1}{2} f(i)^2f(k)
\right)
+ \sum_{3i=n-1} \left(
    \frac{1}{3}  f(i)^3
    + \binom{f(i)+2}{3}
    - \binom{f(i)+1}{2} f(i)
\right)
\\
&= \frac{1}{6} \sum_{i,j,k} f(i)f(j)f(k)
+ \frac{1}{2} \sum_{2i+k=n-1} f(i)f(k)
+ \frac{1}{3} \sum_{3i=n-1} f(i)

\end{aligned}
$$

十分可爱！——Q 如此评价道。

以上也可以用 Polya 定理推导。

### 分离变量

有了以上的式子，我们就可以分离变量，分散计算了。

$$
\begin{aligned}

f(x) &=
\frac{1}{6} \sum_{i,j,k} f(i)f(j)f(k)
+ \frac{1}{2} \sum_{2i+k=n-1} f(i)f(k)
+ \frac{1}{3} \sum_{3i=n-1} f(i)
\\
&= \sum_{0\le k\le n-1} f(k) \left(
    \frac{1}{6} \left( \sum_{0\le i\le n-1-k}{f(i)f(n-1-k-i)} \right)
    + \frac{1}{2} f\left(\frac{n-1-k}{2}\right)
\right)
+ \frac{1}{3} f\left( \frac{n-1}{3} \right)
\\
& \qquad \text{注：} \forall x\notin\mathbb{N}, f(x) \mathop{=}\limits^\text{def} 0
\\

\end{aligned}
$$

令 $g(n) = \displaystyle \frac{1}{6} \left( \sum_{0\le i\le n}{f(i)f(n-i)} \right) + \frac{1}{2} f\left(\frac{n}{2}\right)$，则

$$
f(n) =
\sum_{0\le k\le n-1} f(k)g(n-1-k)
+ \frac{1}{3} f\left( \frac{n-1}{3} \right)
$$

我们容易发现，有两个类似卷积形式的求和，以上公式也可以写成

$$
\begin{aligned}

f(n) &= (f*g)(n-1) + \frac{1}{3} f\left(\frac{n-1}{3}\right)
\\
g(n) &= \frac{1}{6}(f*f)(n) + \frac{1}{2} f
\left(\frac{n}{2}\right)

\end{aligned}
$$

:::tip 注意
此处只是取卷积中的一项，如果使用完整的卷积，虽然有 FFT，但是会造成冗余。
:::

<垃圾话> 看到这个公式，F 就忍不住让我用 FFT 了。我告诉他只是取其中一项，然而他还是坚持自己的直觉。</垃圾话>

或者，我们将 $f, g$ 看成数据结构，则有转移方程

$$
\begin{aligned}

& f.\mathrm{append}\left( f \otimes g + \frac{1}{3} f\left(\frac{n-1}{3}\right) \right)
\\
& g.\mathrm{append}\left( \frac{1}{6} f \otimes f + \frac{1}{2} f
\left(\frac{n}{2}\right) \right)

\end{aligned}
$$

其中 $f \otimes g = f \cdot \operatorname{rev}(g)$.

如果你不想要小数，令 $g'(n) = 6g(n)$ 即可。

$$
\begin{aligned}

& f.\mathrm{append}\left( \frac{1}{6} \left( f \otimes g  + 2f\left(\frac{n-1}{3}\right)\right) \right)
\\
& g.\mathrm{append}\left( f \otimes f + 3 f
\left(\frac{n}{2}\right) \right)

\end{aligned}
$$

以上的公式形式简洁、计算方便，是手工计算的不二之选。

```python
def rev_prod(l1, l2):
    return sum(a*b for a, b in zip(l1, l2[::-1]))

f = [1]
g = [4]

for i in range(1, 10):
    f.append((rev_prod(f, g) + (f[(i-1)//3]*2 if i%3==1 else 0)) // 6)
    g.append(rev_prod(f, f) + (f[i//2]*3 if i%2==0 else 0))
    print(f'-C{i}H{2*i+1} 共有 {f[i]} 种同分异构体')
```

## 从 O(n^2) 到 O(n sqrt(nlogn))

通过上面的化简，我们就可以将问题抽象化，只需要找到一个（一对）支持 $\text{append}$ 和 $\otimes$ 操作的数据结构即可。  
那么，我们能否寻找一个更快的数据结构，支持尾插以及 $\otimes$ 运算呢？

DeepSeek 说不行，但是在这件事情上，DeepSeek 甚至没有占卜来得靠谱。当然，我没有占卜过，但是当我看到这个数据结构的时候，冥冥之中总感觉它可以优化到 $O(n\sqrt{n})$.

所以我偏要去优化。  
~~其实这人是受化学老师刺激了。~~

我们的插入是 $O(1)$ 而运算是 $O(n)$ 的。根据此消彼长~~我瞎编的~~原理，我们要给插入操作制造冗余信息，才能用这些信息来优化运算。

是的。我为什么在前面讲了 FFT 呢？就是埋了个伏笔啊！

我们看看 FFT 是如何加速运算的。

:::tip 注意
之后的推导都是对数据结构抽象的推导，与实际问题不直接相关。
:::

首先我们来解个莫名其妙的不等式：$0 \le i,n-i \le p ~(0 \le p \le n)$，  
答案很简单，就是 $n-p \le i \le p$.

接下来我们要干什么呢？让我们把求和分块：

$$
\sum_{i=0}^{n} a(i)b(n-i) = \sum_{i=n-p}^{p} a(i)b(n-i) + \sum_\text{otherwise} a(i)b(n-i)
$$

关注第一个和式，有

$$
\displaystyle\sum_{i=n-p}^{p} a(i)b(n-i)
= (a_{0..p} * b_{0..p})(n)
$$

:::info 注
根据之前的解不等式，由于 $n-i \le p$ 的限制，$i$ 的下限取不到 $0$.
:::

显然，可以用 FFT，一次性 $O(p\log p)$ 地把 $(a_{0..p} * b_{0..p})$ 算出来。  
剩下的求和，时间复杂度为 $O(n-p)$.

其实就是类似分块打表的思想。

全部加起来，总时间复杂度为

$$
T(N) =
\displaystyle \left(\sum_{n=1}^{N}n-\max_{\substack{p\in P \\ p\le n}} p \right)
+ \left( \sum_{p\in P} p \log p \right)
$$

~~P 是 Preprocessing 的意思，不是 prime 啊！用质数数列当 p 肯定是不行的啦！~~

所以，我们怎么选择 $p$ 点，使得复杂度最小呢？

### 一个块长调一天

首先我们用特殊值探个路。

我们设 $p_i = ki$，也就是等距取 $p$.

于是我们有

$$
\begin{aligned}

T(N)
&= O\left( Nk + \sum_{i=1}^{N/k} ki\log i \right)
\\
&= O\left(Nk + \frac{N^2}{k} \log N \right)
\\
&\ge O\left(N \sqrt{N \log N} \right)

\end{aligned}
$$

当 $k=\sqrt{N \log N}$ 时取等。

当然，由于常数的关系，$\sqrt{N \log N}$ 未必是最佳的块长。不过这不影响它的复杂度。

### 块长最优性证明

设 $p_i$ 在 $x$ 处的密度为 $\rho(x) \in [0,1]$，用相近的方法对以上的求和做积分近似：

$$
\begin{aligned}

T(N)
&= O\left( \int_1^N \rho(x)x \log x + (1-\rho(x)) \frac{1}{\rho(x)} ~\mathrm{d}x \right)
\\
&= O\left( -N + \int_1^N \rho(x)x \log x + \frac{1}{\rho(x)} ~\mathrm{d}x \right)
\\
&= O\left( -N + \int_1^N \rho(x)x \log x + \frac{1}{\rho(x)} ~\mathrm{d}x \right)
\\
&\ge O\left( -N + \int_1^N \sqrt{x \log x} ~\mathrm{d}x \right)
\\
&= O(N \sqrt{N \log N})

\end{aligned}
$$

取等条件是 $\rho(x)=\dfrac{1}{\sqrt{x\log x}}$，这预示着 $p_{i+1} = p_i + C\sqrt{p_i\log_2{p_i}}$.

但是简单起见，我们仍然使用 $p_i = ki$，它的复杂度也是一样的。

<垃圾话算到这里，我竟激动得无法入眠。不知怎地，天空忽然下起了大雨。我想，那是因为我心中的乌云已经~~被可莉炸掉了~~被彻底扫清了罢。</垃圾话>

### 核心真伪难辨代码片段

```python
def rev_prod(l1, l2):
    return sum(a*b for a, b in zip(l1, l2[::-1]))


class DataStructure:
    def __init__(self, x, y, k):
        self.a = [x]
        self.b = [y]
        self.k = k
        self.max_idx = 0

        self.p = -1
        self.conv = []

    def add(self, x, y):
        self.a.append(x)
        self.b.append(y)
        self.max_idx += 1

        if self.max_idx % self.k == 0:
            self.p = self.max_idx
            self.conv = conv(self.a, self.b)

    def calc(self):
        if 2*self.p < self.max_idx:
            return rev_prod(self.a, self.b)
        else:
            ans = self.conv[self.max_idx]
            ans += sum(self.a[i]*self.b[self.max_idx-i] 
                       for i in range(self.max_idx-self.p))
            ans += sum(self.a[i]*self.b[self.max_idx-i] 
                       for i in range(self.p+1, self.max_idx+1))
            return ans
```

## 关于时间复杂度与优绩主义的桎梏

有人要问了：

> 对于烷烃计数，已经有 $O(N \log N)$ 的算法了，为什么还要设计一个更慢的算法呢？

是的，这样这样的确算不上什么突破。但是探索的乐趣却是实打实的。  
语文期中考，作文主题是“无用之用”。这两件事，或许有异曲同工之妙吧。

## P-1 烷基计数

### 题目背景

搓了个 $O(N\sqrt{N\log N})$ 的算法。

### 题目描述

求有 $n$ 个碳原子个数的烷基有多少种同分异构体。

### 输入格式

本题多测。  
第一行一个整数 $T$，接下来 $T$ 行，每行一个整数 $n_i$.

### 输出格式

输出 $T$ 行，第 $i$ 行输出 $n_i$ 个碳原子个数的烷基的同分异构体数目，对 $998244353$ 取模。

### 数据范围

$1 \le T, n_i \le 5\times10^4$.

## 番外：卡常小能手

$f \otimes f$ 是对称的，计算量可以砍一半。

然后我们再用 $p_{i+1} = p_i + \mu p_i\log_2{p_i}$ 优化块长。接下来就是决定最优的 $\mu$ 值，三分即可。

取整数的 $\mu = 3$，此时和生成函数+牛顿迭代只差一个数量级，机子好一点可以卡过。

## 附录：题目的 C++ 实现

```cpp
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;

const ll mod = 998244353, 
      one_sixth = (mod+1) / 6,  // 998244354 % 6 == 0
      maxn = 10e4+100;

template<typename _T>
void fread( _T &x ) {
    x = 0; char s = getchar(); bool f = false;
    while( s < '0' || '9' < s ) { f = s == '-', s = getchar(); }
    while( '0' <= s && s <= '9' ) { x = ( x << 3 ) + ( x << 1 ) + ( s - '0' ), s = getchar(); }
    if( f ) x = -x;
}

template<typename _T>
void fwrite( _T x ) {
    if( x < 0 ) putchar( '-' ), x = -x;
    if( 9 < x ) fwrite( x / 10 );
    putchar( x % 10 + '0' );
}

template<ll Mod, ll G>  // Mod必须为满足NTT条件的质数，G为对应的原根
struct NTT {
    // 快速幂（内部使用，无需暴露）
    static ll _pow(ll a, ll b) {
        ll res = 1;
        while (b) {
            if (b & 1) res = res * a % Mod;
            a = a * a % Mod;
            b >>= 1;
        }
        return res;
    }

    // 位逆序预处理
    static vector<int> _get_rev(int len, int bit) {
        vector<int> rev(len);
        for (int i = 0; i < len; ++i)
            rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (bit - 1));
        return rev;
    }

    // 核心变换函数（invert=false为正变换，invert=true为逆变换）
    static void _transform(vector<ll>& a, const vector<int>& rev, bool invert) {
        int n = a.size();
        for (int i = 0; i < n; ++i)
            if (i < rev[i]) swap(a[i], a[rev[i]]);

        for (int len = 2; len <= n; len <<= 1) {
            ll wn = _pow(G, (Mod - 1) / len);
            if (invert) wn = _pow(wn, Mod - 2);
            
            for (int i = 0; i < n; i += len) {
                ll w = 1;
                for (int j = 0; j < len/2; ++j) {
                    ll u = a[i + j], v = a[i + j + len/2] * w % Mod;
                    a[i + j] = (u + v) % Mod;
                    a[i + j + len/2] = (u - v + Mod) % Mod;
                    w = w * wn % Mod;
                }
            }
        }

        if (invert) {
            ll inv_n = _pow(n, Mod - 2);
            for (ll& x : a) x = x * inv_n % Mod;
        }
    }

    // 卷积入口函数
    static vector<ll> convolve(vector<ll> a, vector<ll> b) {
        int n = a.size(), m = b.size();
        if (n == 0 || m == 0) return {};

        int len = 1, bit = 0;
        while (len < n + m - 1) len <<= 1, ++bit;
        
        a.resize(len); b.resize(len);
        auto rev = _get_rev(len, bit);
        
        _transform(a, rev, false);
        _transform(b, rev, false);
        for (int i = 0; i < len; ++i)
            a[i] = a[i] * b[i] % Mod;
        _transform(a, rev, true);
        
        a.resize(n + m - 1);
        return a;
    }
    
    static vector<ll> self_convolve(vector<ll> a) {
        int n = a.size();
        if (n == 0) return {};

        int len = 1, bit = 0;
        while (len < 2*n - 1) len <<= 1, ++bit;

        vector<int> rev = _get_rev(len, bit);
        a.resize(len);

        // 只需一次正变换
        _transform(a, rev, false);
        
        // 点乘平方
        for (int i = 0; i < len; ++i)
            a[i] = a[i] * a[i] % Mod;

        _transform(a, rev, true);
        a.resize(2*n - 1);
        return a;
    }
};

NTT<mod, 3> ntt;
bool isp[maxn];

struct DS {
    vector<ll> a, b;
    ll maxidx;
    ll p=-1;
    vector<ll> conv;
    bool is_symmetrical;
    
    DS (ll x, ll y, bool is_symmetrical_=false): 
            maxidx(0), 
            p(-1), 
            is_symmetrical(is_symmetrical_) {
        a.push_back(x);
        b.push_back(y);
    }
    
    void add(ll x, ll y){
        maxidx++;
        a.push_back(x);
        b.push_back(y);
        
        if (isp[maxidx]){
            p = maxidx;
            conv = is_symmetrical? ntt.self_convolve(a): ntt.convolve(a, b);
        }
    }
    
    ll calc(){
        if ((p<<1) < maxidx){
            ll ans = 0;
            for (int i=0; i<=maxidx; i++){
                ans += a[i] * b[maxidx-i] % mod;
                ans %= mod;
            }
            return ans;
        } 
        
        ll ans = conv[maxidx], add=0;
        for (int i=0; i<maxidx-p; i++){
            add += a[i] * b[maxidx-i] % mod;
            add %= mod;
        }
        if (is_symmetrical) {
            add <<= 1;
            add %= mod;
        } else {
            for (int i=p+1; i<=maxidx; i++){
                add += a[i] * b[maxidx-i] % mod;
                add %= mod;
            }
        }
        
        return (ans + add) % mod;
    }
};

const ll mu = 3;
ll n[maxn];
ll f[maxn], g[maxn];

inline void solve(ll N){
    for (int p=4; p<=N; p+=mu*sqrt(p*log2(p))){
        isp[p] = true;
    }
    
    f[0] = 1;
    g[0] = 4;
    
    DS ffds(1, 1, true), 
       fgds(1, 4);
    
    for (int i=1; i<=N; i++){
        f[i] = (fgds.calc() + 
                (i%3==1? (f[(i-1)/3]<<1): 0)) 
               % mod * one_sixth % mod;
        ffds.add(f[i], f[i]);
        g[i] = (ffds.calc() + 
                ((i&1)? 0: (f[i>>1]*3))) % mod;
        fgds.add(f[i], g[i]);
    }
}

int main(){
    ll T, N=0;
    fread(T);
    for (int i=1; i<=T; i++){
        fread(n[i]);
        N = max(N, n[i]);
    }    
    
    solve(N);
    
    for (int i=1; i<=T; i++){
        fwrite(f[n[i]]);
        putchar('\n');
    }
    
    return 0;
}
```

!!有没有人发现，Yet Another Alkyls Counting Algorithm 的首字母缩写是 YAACA，然后让我们把 AA 看成 M……一阵强劲的音乐响起!!
