---
title: 疯狂进食（持续更新）
createTime: 2024/12/11
categories:
    - IT
tags:
    - OI
---

在这里存点我的黑历史（（

## inline

```cpp
inline func(...){
    ...
}
```

在本地能过，但是交上去会爆零。

## 加强

写完[蛇蛇放置](https://www.luogu.com.cn/problem/U511581)的 std 之后发现跑得太快了，于是增大了一下数据范围。

但是我没改 std。

> 推销：**来做蛇蛇放置喵，来做蛇蛇放置谢谢喵**

## size

```cpp
int size[maxn];
```

您的 $\color{#cc0}\text{CE}$ 好帮手。

## 字符

```cpp
char c;
cin >> c;
int a = c-0;
```

导致我的 NOIP 1h 没了的罪魁祸首。

## move

```cpp
void move(bool x){
    ...
}

...

move(xxx);
```

`std::move`：亻尔女子。

:::tip C++ Reference

```cpp
template < class T >
constexpr std::remove_reference_t<T>&& move( T&& t ) noexcept;
```

:::

## 转置

> 第二行 $n$ 个整数 $A_i$。
> 第三行 $n$ 个整数 $B_i$。

```cpp
for (int i=1; i<=n; i++){
    cin >> a[i] >> b[i];
}
```

转置领域大神！

## 行列不分

这次是[摸个鱼鱼](https://www.luogu.com.cn/problem/U514748) checker 出锅，满屏 $\color{#0E1D69}\text{UKE}$。

```cpp
n = inf.readInt();
m = inf.readInt();
k = inf.readInt();
for (int i=1; i<=n; i++){
    for (int j=1; j<=n; j++){
        a[i][j] = inf.readInt();
    }
}
```

## 有些话明明想好了却无法说出口

有些 {.inline}
:::ruby 变量
话
:::
明明 {.inline}
:::ruby 生成
想
:::
好了却无法 {.inline}
:::ruby 输出
说出口
:::

```python
k = strong_rand(K, 1) if K>2 else K
test_data.input_writeln(n, m)
```

让我们恭喜[摸个鱼鱼](https://www.luogu.com.cn/problem/U514748)拿下双杀。

## n 有双重人格

```cpp
int n;
...
int main(){
  int n;
  cin >> n;
}
```

## 双重循环

```cpp
inline void init_st(){
    for (int i=1; i<=n; i++){
        for (int j=1; i+(1<<j)-1<=n; j++){
            st[i][j] = gcd(st[i][j-1], st[i+(1<<(j-1))][j-1]);
        }
    }
}
```

ST 表/区间 DP 笑传之初创备。

## 左右不分

```cpp
int len = l - r + 1;
```

我已无法理解此人。

## 自动取整

```cpp
int dis = sqrt(x*x + y*y);
```

我将无情地割舍一切（丢掉小数部分）

## 广义滑动窗口

```cpp
for (int i=1; i<=i+n; i++)
```

小明永远地追逐着小红，
小红只是 {.inline}
:::ruby return
回以
:::
$\color{red} 3221225477$. {.inline}

## 变量名灾难

```cpp
int maxa = -1, maxi=-1;
for (int i=1; i<=n; i++){
    if (ans[i] > maxi){
        maxa = ans[i];
        maxi = i;
    }
}
```

~~居然能拿 20 分，这数据也是没谁了。~~

## 未完待续
