---
title: 一些USACO水题
createTime: 2024/10/06
categories:
    - IT
tags:
    - OI
---

##  [http://hfoj.net/contest/66f600df81e14fdd273ee341](http://hfoj.net/contest/66f600df81e14fdd273ee341) super water
### （枚举）[http://hfoj.net/p/2607](http://hfoj.net/p/2607) #2607. [USACO22FEB] Blocks B 
```cpp
#include <bits/stdc++.h>
using namespace std;

bool has[6][256];
string s;

bool get(int a, int b, int c, int d){
	int ww[6] = {a, b, c, d};
	for (int i=0; i<s.size(); i++){
		if (!has[ww[i]][s[i]]){
			return false;
		}
	}
	return true;
}

bool work(){
	cin >> s;
	for (int a=1; a<=4; a++){
		for (int b=1; b<=4; b++){
			for (int c=1; c<=4; c++){
				for (int d=1; d<=4; d++){
					if (a==b || b==c || c==d || a==c || b==d || a==d){
						continue;
					}
					if (get(a, b, c, d)){
						return true;
					}
				}
			}
		}
	}
	return false;
}

int main(){
	int n;
	cin >> n;
	for (int i=1; i<=4; i++){
		string block;
		cin >> block;
		for (char c: block){
			has[i][c] = true;
		}
	}
	
	for (int i=1; i<=n; i++){
		cout << (work() ? "YES\n" : "NO\n");
	}
	return 0;
}

```
### （模拟）[http://hfoj.net/p/P8090](http://hfoj.net/p/P8090) #P8090. [USACO22JAN] Herdle B 
**91 pts**
```cpp
#include <bits/stdc++.h>
using namespace std;

int cnt[256];
char correct[16], guess[16];

int main(){
	cin >> correct+1 >> correct+4 >> correct+7;
	cin >> guess+1 >> guess+4 >> guess+7;
	
	for (int i=1; i<=9; i++){
		cnt[correct[i]]++;
	}
	
	int green=0, yellow=0;
	
	for (int i=1; i<=9; i++){
		if (!cnt[guess[i]]){
			continue;
		}
		
		if (correct[i] == guess[i]){
			green++;
		} else {
			yellow++;
		}
		
		cnt[guess[i]]--;
	}
	
	cout << green << endl << yellow << endl;
	return 0; 
}

```
### （单调队列/栈）[http://hfoj.net/p/P8094](http://hfoj.net/p/P8094)  #P8094. [USACO22JAN] Cow Frisbee S 
```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long

const int maxn=3e5+10;

struct item {
	int i, h;
};

signed main(){
	int n;
	cin >> n;
	
	int ans=0;
	stack<item> q;
	
	for (int i=1; i<=n; i++){
		int h;
		cin >> h;
		
		while (!q.empty() && q.top().h<h){
			ans += i-q.top().i+1;
			q.pop();
		}
		
		if (!q.empty()){
			ans += i-q.top().i+1;
		}
		
		if (!q.empty() && q.top().h == h){
			q.pop();
		}
		
		q.push({i, h});
	}
	
	cout << ans;
	return 0;
}

```
### （枚举）[http://hfoj.net/p/P8091](http://hfoj.net/p/P8091) #P8091. [USACO22JAN] Non-Transitive Dice B 
```cpp
#include <bits/stdc++.h>
using namespace std;

inline int cmp(int a[6], int b[6]){
	// return win(a)-win(b);
	int awin=0, bwin=0;
	
	for (int i=1; i<=4; i++){
		for (int j=1; j<=4; j++){
			if (a[i] > b[j]){
				awin++;
			}
			if (a[i] < b[j]){
				bwin++;
			}
		}
	}
	
	return awin-bwin;
}

int main(){
	int t;
	cin >> t;
	while (t--){
		int a[6], b[6], c[6];
		for (int i=1; i<=4; i++){
			cin >> a[i];
		}
		for (int i=1; i<=4; i++){
			cin >> b[i];
		}
		
		int abcmp = cmp(a, b);
		if (abcmp==0){
			puts("no");
			continue;
		}
		if (abcmp < 0){
			swap(a, b);  // 保证a>b 
		}
		
		// find c>a>b>c
		for (c[1]=1; c[1]<=10; c[1]++){
			for (c[2]=c[1]; c[2]<=10; c[2]++){
				for (c[3]=c[2]; c[3]<=10; c[3]++){
					for (c[4]=c[3]; c[4]<=10; c[4]++){
						if (cmp(c,a)>0 && cmp(b,c)>0){
							puts("yes");
							goto _yes;
						}
					}
				}
			}
		}
		
		puts("no");
		
		_yes:;
	}
		
	return 0;
}

```
### （区间+树状数组）[http://hfoj.net/p/P9010](http://hfoj.net/p/P9010) #P9010. [USACO23JAN] Leaders B 
```cpp
#include <bits/stdc++.h>
using namespace std;

// 由Ei>=i显然不存在环 

const int maxn=2e5+10;

int n;
char cow[maxn];
int e[maxn];
bool isldr[maxn];

int lowbit(int x){
	return x&-x;
}


struct bit {
	int a[maxn];
	void add(int i, int x){
		for (; i<=n; i+=lowbit(i)){
			a[i] += x;
		}
	}
	
	int query(int i){
		int ans=0;
		for (; i; i-=lowbit(i)){
			ans += a[i];
		}
		return ans;
	}
};

bit ldrg, ldrh;

int main(){
	int ming=12345690, maxg=-1, minh=1234567890, maxh=-1;
	
	cin >> n >> cow+1;
	for (int i=1; i<=n; i++){
		cin >> e[i];
		if (cow[i] == 'G'){
			ming = min(ming, i);
			maxg = i;
		} else {
			minh = min(minh, i);
			maxh = i;
		}
	}
	
	int ans=0;
	int ldg=0, ldh=0;
	
	for (int i=1; i<=ming; i++){
		if (cow[i]=='G' && e[i] >= maxg){
			ldrg.add(i, 1);
			ldg++;
			isldr[i] = true;
		}
	}
	
	for (int i=1; i<=minh; i++){
		if (cow[i]=='H' && e[i]>=maxh){
			ldrh.add(i, 1);
			ldh++;
			isldr[i] = true;
		}
	}
	
	ans += ldg * ldh;
	
	for (int i=1; i<=n; i++){
		if (isldr[i]){
			continue;
		}
		
		if (cow[i]=='G'){
			ans += ldrh.query(e[i]) - ldrh.query(i-1);
		} else {
			ans += ldrg.query(e[i]) - ldrg.query(i-1);
		}
	}
	
	cout << ans;
	return 0;
}
```