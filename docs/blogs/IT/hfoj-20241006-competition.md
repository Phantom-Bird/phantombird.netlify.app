---
title: OI 2024.10.6 (HFOJ)
createTime: 2024/10/06
tags:
 - OI
categories:
 - IT
---

## [link](http://hfoj.net/contest/66f6650081e14fdd273f46e7)

[正解](http://hfoj.net/contest/66f6650081e14fdd273f46e7/file/sol.pdf)  ，另外正解第二题的 $k=3n$ 记录已经被我打破。

### （乘法原理+均值不等式求min）[1 i am human](http://hfoj.net/p/2608) 
被提示坑了。

答案一定形如
`iiiiiaaaaammmmmhhhhuuuummmmaaaannnn`

我们设第 $i$ 个字符重复 $a_i$ 遍

则应在保证 $\prod_{i=1}^8a_i \ge k$ 的情况下最小化 $\sum_{i=1}^8a_i$

显然 $a_i$ 越平均越好。

#### 法1（提交程序）
将 $a_i$ 初始化为 $\lceil \sqrt[8]{n} \rceil$，在保证 $\prod_{i=1}^8a_i \ge k$ 的情况下依次下调 $a_i~$

计算 $\lceil \sqrt[8]{n} \rceil$ 有额外开销与精度丢失。
#### 法2（标程）
令答案 $L=\sum_{i=1}^8a_i$，此时平均分配为
$$a_{1}=\cdots=a_{L\%8}=\left\lfloor{L\over8}+1\right\rfloor$$
$$a_{L\%8+1}=\cdots=a_{8}=\left\lfloor{L\over8}\right\rfloor$$
二分答案 $L$，找到最小的 $L$ 使得$\prod_{i=1}^8a_i \ge k$ 即可。
```cpp
#include <bits/stdc++.h>
using namespace std;

char ch[10] = "#iamhuman";
int cnt[10];

inline long long powx8(long long u){
	u = u * u;
	u = u * u;
	u = u * u;
	return u;
}

inline long long get(){
	long long ans=1;
	for (int i=1; i<=8; i++){
		ans *= cnt[i];
	}
	return ans;
}

int main(){
	freopen("iamhuman.in", "r", stdin);
	freopen("iamhuman.out", "w", stdout);
	
	long long n;
	cin >> n;
	
	long long u = sqrt(sqrt(sqrt(n)));
	while (powx8(u) < n){
		u++;
	}
//	printf("u=%d\n", u);
	
	for (int i=1; i<=8; i++){
		cnt[i] = u;
	}
	for (int i=1; i<=114514; i++){
		cnt[(i-1)%8+1]--;
		if (get()<n){
			cnt[(i-1)%8+1]++;
			break;
		}
	}
	
	for (int i=1; i<=8; i++){
		while (cnt[i]--){
			putchar(ch[i]);
		}
	}
	return 0;
}
```
### （乘法原理+均值不等式求min）[2b circle](http://hfoj.net/p/2618) 
**95 pts**

设每**半边**分为c段，我们发现
$$\prod_{i=1}^{c} a_i\ge k$$
$$ans=c+\sum_{i=1}^c a_i$$

求助~~猪猪侠~~Geogebra发现对于函数
$$f(x)=\sqrt[x]{k}+x$$
$\forall 1\le k\le10^{18},1\le x_{\min y}\le30$

枚举 $1 \le c \le 30$，像T1一样解即可。TLE掉一个点。

```cpp
//mul(a)>=k
//ans/2=sum(a)+cnt(a)

#include <bits/stdc++.h>
using namespace std;

const int maxl=30, powep=16, forlimit=powep*maxl;

inline long long strongroot(long long x, long long y){
	long long u=pow(x, 1.0/y);
	for (int i=powep; i; i>>=1){
		if (pow(u+i, y) <= x){
			u += i;
		}
	}
	if (pow(u, y) < x){
		u++;
	}
	return u;
}

long long a[maxl+10];

inline long long get(int l){
	long long ans=1;
	for (int i=1; i<=l; i++){
		ans *= a[i];
	}
	return ans;
}

long long solve(long long n, int l){
	long long u=strongroot(n, l);
//	printf("l=%d; u=%d\n", l, u);
	
	for (int i=1; i<=l; i++){
		a[i] = u;
	}
	
	long long mul=get(l);
	
	for (int i=1; i<=forlimit; i++){
		int index = (i-1)%l+1;
		
		mul = mul / a[index] * (a[index]-1);
		
		if (get(l)<n){
			a[index]++;
			break;
		}
		a[index]--;
	}
	
	long long halfans=l;
	for (int i=1; i<=l; i++){
		halfans += a[i];
	}
	
//	printf("ans=%d\n", 2*halfans);
	return halfans * 2;
}

int main(){
	freopen("circle.in", "r", stdin);
	freopen("circle.out", "w", stdout);
	
	ios::sync_with_stdio(false);
	cin.tie(0);
	
	int t;
	cin >> t;
	while (t--){
		long long n;
		cin >> n;
		long long ans = 0x3f3f3f3f3f3f3f3f;
		for (int i=1; i<=maxl; i++){
			ans = min(ans, solve(n, i));
		}
		cout << ans << '\n';
	}
}
```
### （最小生成树&&纯暴力）[4 mst](http://hfoj.net/p/2611) 
**20 pts**
```cpp
#include <bits/stdc++.h>

#define int long long

using namespace std;

const int maxn=3e5+10;

int n, m;

int fa[maxn];
int rk[maxn];

void initdsu(){
	for (int i=0; i<=n; i++){
		fa[i] = i;
		rk[i] = 1;
	}
}

int find(int x){
	if (fa[x] == x){
		return x;
	}
	return (fa[x] = find(fa[x]));
}

void union_(int fx, int fy){
	if (fx == fy){
		return;
	}
	if (rk[fx] < rk[fy]){
		swap(fx, fy);
	}
	fa[fy] = fx;
	rk[fx] += rk[fy];
}

struct edge {
	int u, v, w;
	
	bool operator < (edge &b){
		return w < b.w;
	}
} raw[2*maxn], sorted[2*maxn];

long long work(){
	initdsu();
	
	for (int i=1; i<=n+m; i++){
		sorted[i] = raw[i];
	}
	
	sort(sorted+1, sorted+n+m+1);
	
	int cnt=0, ans=0;
	for (int i=1; i<=n+m; i++){
//		printf("proc %d %d %d\n", sorted[i].u, sorted[i].v, sorted[i].w);
		
		int u=sorted[i].u,
			v=sorted[i].v;
			
		int fu=find(u), fv=find(v);
		
		if (fu == fv){
			continue;
		}
		
//		printf("add^\n");
		union_(fu, fv);
		ans += sorted[i].w;
		cnt++;
		if (cnt == n){
			break;
		}
	}
	
	return ans;
}

signed main(){
	freopen("mst.in", "r", stdin);
	freopen("mst.out", "w", stdout);
	
	ios::sync_with_stdio(0);
	cin.tie(0);
	
	cin >> n >> m;
	for (int i=1; i<=n; i++){
		raw[i].v = i;
		cin >> raw[i].w;
	}
	
	for (int i=n+1; i<=n+m; i++){
		cin >> raw[i].u >> raw[i].v >> raw[i].w;
	}
	
	int q;
	cin >> q;
	
	while (q--){
		int x, y;
		cin >> x >> y;
		raw[x].w = y;
		cout << work() << '\n';
	}
	return 0;
}
```
### （构造）[2a picture](http://hfoj.net/p/2609) 
**0pts/80pts**

**[link~](https://www.cnblogs.com/h-lka/p/13169742.html)**

一种简单的构造方法：
```txt
##
###
 ###
  ###
   ###
    ##
```

$k=3n+4$ 在 $n \ge 299$ 时 $ans \gt 900$ WA掉。

```cpp
#include <bits/stdc++.h>
using namespace std;

int main(){
	freopen("picture.in", "r", stdin);
	freopen("picture.out", "w", stdout);
	
	int n;
	cin >> n;
	printf("%d\n", 3*n+4);
	printf(
		"1 1\n"
		"1 2\n"
		"2 1\n"
		"2 2\n"
	);
	for (int i=1; i<=n; i++){
		printf(
			"%d %d\n%d %d\n%d %d\n",
			i+1, i+2,
			i+2, i+1,
			i+2, i+2
		);
	}
	return 0;
}
```