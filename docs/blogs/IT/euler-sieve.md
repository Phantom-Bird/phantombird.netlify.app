---
title: 线性筛
createTime: 2025/6/26
---

今天晚自习被 GooodPig 和 Function 拉去解决他们关于 $\tau(n)$ 的猜想.

故复习了下线性筛.

线性筛要求：**每个合数都被它最小的质因数筛掉**. 它不仅能够保证效率，而且最小质因数的性质为我们求 $\tau(n)$ 有很大的帮助.

学习线性筛，先要改变一下观念. 寻常的筛是将一个质数的所有倍数筛掉，而线性筛的写法是：把一个数的所有质数倍筛掉. 显然两者是等价的.

我们记 $n$ 的最小质因数为 $\mathrm{mp}(n)$，要使得 $p = \mathrm{mp}(i \times p)$，必须满足：$p \le \mathrm{mp}(i)$.

于是，我们搜到 $p = \mathrm{mp}(i)$ 之后，直接 `break`，就实现了线性筛.

```cpp
bool notp[maxn];
vector<int> primes;

void sieve(int n) {
    notp[1] = true;
    
    for(int i = 2; i <= n; i++) {
        if(!notp[i]) {
            primes.push_back(i);
        }
            
        for(int p: primes)
        {
            notp[i * p] = true;
            if(i %  p == 0)
                break;
        }
    }
}
```

## τ {#tau}

我们知道，

$$\tau(n) = \prod_p (1+v_p(n))$$

其中 $v_p(n)$ 代表 $n$ 的质因数分解的 $p$ 对应的指数

设 $p = \operatorname{mp}(n), n = i \times p$，则有

$$
\frac{\tau(n)}{\tau(m)}
= \frac{1 + v_p(n)}{1 + v_p(m)}
= \begin{cases}
\dfrac{v_p(m) + 2}{v_p(m) + 1}, & p = \operatorname{mp}(m) \\
2, & \text{otherwise}
\end{cases}
$$

而 $v_p(n) + 1$ 正是右式的分母，以下代码中的 `mft` 也是指这个值.

以下是输出 $\tau(n)$ 的前缀最大值的代码：

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=1e6+10;

vector<int> primes;
bool is_not_prime[maxn];
int tau[maxn];
int mft[maxn];


signed main() {
    int n;
    cin >> n;
    
    tau[1] = 1;
    mft[1] = 1;
    
    for (int i = 2; i <= n; i++) {
        if (!is_not_prime[i]) {
            primes.push_back(i);
            tau[i] = 2;
            mft[i] = 2;
        }

        for (int p: primes) {
            if (i * p > n){
                  break;
            }
            
            is_not_prime[i*p] = true;
            
            
            if (i % p == 0){
                tau[i*p] = tau[i] / mft[i] * (mft[i] + 1);
                mft[i*p] = mft[i] + 1;
            } else {
                tau[i*p] = tau[i] * 2;
                mft[i*p] = 2;
            }
            
            
            if (i % p == 0){
                  break;
            }
        }

    }
    
    int pmax=-0x3f3f3f3f3f3f3f3f;
    for (int i=1; i<=n; i++){
        if (tau[i] > pmax){
            printf("%d ", tau[i]);
            pmax = tau[i];
        }
    }

    return 0;
}
```
