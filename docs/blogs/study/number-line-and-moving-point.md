---
title: 数轴与动点知识手册
createTime: 2022/01/07
categories:
    - study
#^ tags
---

:::tip
这里只供留档原汁原味的版本。
[更好的阅读体验](number-line-and-moving-point-remake)
:::

::: code-tabs

@tab Markdown
```md
## 1 数轴
### 1.1 两点间距离公式

> 设$A:a, B:b$  
> $AB=|a-b|$  

## 2 绝对值
### 2.1 数值计算
定义：
$|a|=\Big\{
\begin{array}{ll}
a  & a>0 \
0  & a=0 \
-a & a<0
\end{array}$

#### 2.1.1 绝对值 × 某数
> (1) 若 $a\ge0$  
> $a|x| = |ax|$  
> (2) 若 $a\lt0$  
> $a|x| = -|ax|$  

#### 2.1.2 绝对值 = 某数
> $\because$ $|x|=a$，   
> $\therefore x=a$ 或 $x=-a$ （$x+a=0$）  

#### 2.1.3 绝对值 + 绝对值 = 0
> $\because |x| + |y|=0$  
> $又\because |x|\ge0, |y|\ge0$  
> $\therefore x=y=0$ 

#### 2.1.4 绝对值 = 绝对值
> $\because |x|=|y|$  
> $\therefore x=y$ 或 $x=-y$ （$x+y=0$）  

#### 2.1.5 拓展：零点分段法
**注意：此方法只在走投无路的时候用。**  
**食用提示：大家可以[跳过这段](#)，因为这部分~~又长又臭~~还不常用。**  
绝大部分的问题用[上述方法](#21-数值计算)和<a href="#2.2">绝对值的几何意义</a>就可以解决，但有时候，我们会遇到像$|2x|+|x+1|-|2x-1|=2$一样的无赖式子  
1. 零点  
    找零点很简单，只需要令绝对值里面的式子等于零就可以了。  
    例如：  
    1. > $|2x|$  
        $零点：2x=0$  
        $x=0$
    2. > $|x+1|$  
        零点：$x+1=0$  
        $x=-1$  
    3. > $|2x-1|$  
        零点：$2x-1=0$  
        $2x=1$  
        $x=\frac{1}{2}$  

2. 分段  
    $n$ 个零点会分出 $(n+1)$ 段。  
    **注意分段要不要包括零点**  
    还是用那个例子，3个零点，分出了4段：  
    1. $x\lt-1$
    2. $-1\le x\lt0$
    3. $0\le x\lt\frac{1}{2}$
    4. $\frac{1}{2}\le x$
3. 判断正负  
    ~~需要一些不等式的知识~~  
    其实我们可以找个数代进去看看，**还是要注意包不包括零点**。当然，这种东西就不要写在答卷上啦！  
> 举个栗子：  
> $-1\le x<0$  
> 包括零点 $-1$，所以算到 $x+1$ 的时候要注意一下。  
> 找个数：$-\frac{1}{2}$  
> 1. $2x=2\times(-\frac{1}{2})=-1\lt0\rightarrow 2x\lt0$
> 2. $x+1=-\frac{1}{2}+1=\frac{1}{2}>0\rightarrow x+1\ge0$  
   **注意啦！这里包括零点，所以要加等于号!**
> 3. $2x-1=2\times(-\frac{1}{2})-1=-2\rightarrow 2x-1\lt0$

1. 刻在DNA里的绝对值化简  

> 若 $-1\le x<0$  
> $2x<0, x+1\ge0, 2x-1<0$  
> $\therefore 原式=-2x+x+1+2x-1=x$  

- 小心有坑！  
  相信看完上一段之后，有些小伙伴会兴奋起来：$x=2$ ! 
.  
.  
.  
.  
.  
.  
是吗？  
$-1\le x<0$ 感觉自己被抛弃了……  
没错！虽然这个结果很漂亮，但我们必须得：  
<span style="font-size: 36px">不适，舍去</span>  
<span style="color: lightgrey">说实话，这个例子是我随便写的，真没想到这么好</span>  

现在，把这题做完吧。用鼠标划下一行显示答案：  

<span style="color: white">$x=-4或x=\frac{2}{5}$</span>

### 2.2 绝对值的几何意义
今天先不写了，明天再更吧，诶嘿  
```

@tab RawHTML

```html
<h1 id="数轴与动点知识手册"><a href="#数轴与动点知识手册" class="headerlink" title="数轴与动点知识手册"></a>数轴与动点知识手册</h1><h2 id="1-数轴"><a href="#1-数轴" class="headerlink" title="1 数轴"></a>1 数轴</h2><h3 id="1-1-两点间距离公式"><a href="#1-1-两点间距离公式" class="headerlink" title="1.1 两点间距离公式"></a>1.1 两点间距离公式</h3><blockquote>
<p>设$A:a, B:b$<br>$AB=|a-b|$</p>
</blockquote>
<h2 id="2-绝对值"><a href="#2-绝对值" class="headerlink" title="2 绝对值"></a>2 绝对值</h2><h3 id="2-1-数值计算"><a href="#2-1-数值计算" class="headerlink" title="2.1 数值计算"></a>2.1 数值计算</h3><p>定义：$|a|=\Bigg{<br>\begin{array}{ll}<br>a  &amp; a&gt;0 \<br>0  &amp; a=0 \<br>-a &amp; a&lt;0<br>\end{array}$</p>
<h4 id="2-1-1-绝对值-×-某数"><a href="#2-1-1-绝对值-×-某数" class="headerlink" title="2.1.1 绝对值 × 某数"></a>2.1.1 绝对值 × 某数</h4><blockquote>
<p>(1) 若 $a\ge0$</p>
<p>$a|x| = |ax|$</p>
<p>(2) 若 $a&lt;0$</p>
<p>$a|x| = -|ax|$</p>
</blockquote>
<h4 id="2-1-2-绝对值-某数"><a href="#2-1-2-绝对值-某数" class="headerlink" title="2.1.2 绝对值 = 某数"></a>2.1.2 绝对值 = 某数</h4><blockquote>
<p>$\because$ $|x|=a$， </p>
<p>$\therefore x=a$ 或 $x=-a$ （$x+a=0$）</p>
</blockquote>
<h4 id="2-1-3-绝对值-绝对值-0"><a href="#2-1-3-绝对值-绝对值-0" class="headerlink" title="2.1.3 绝对值 + 绝对值 = 0"></a>2.1.3 绝对值 + 绝对值 = 0</h4><blockquote>
<p>$\because |x| + |y|=0$</p>
<p>$又\because |x|\ge0, |y|\ge0$</p>
<p>$\therefore x=y=0$ <br></p>
</blockquote>
<h4 id="2-1-4-绝对值-绝对值"><a href="#2-1-4-绝对值-绝对值" class="headerlink" title="2.1.4 绝对值 = 绝对值"></a>2.1.4 绝对值 = 绝对值</h4><blockquote>
<p>$\because |x|=|y|$</p>
<p>$\therefore x=y$ 或 $x=-y$ （$x+y=0$）</p>
</blockquote>
<h4 id="2-1-5-拓展：零点分段法"><a href="#2-1-5-拓展：零点分段法" class="headerlink" title="2.1.5 拓展：零点分段法"></a>2.1.5 拓展：零点分段法</h4><p><strong>注意：此方法只在走投无路的时候用。</strong><br><br><strong>食用提示：大家可以<a href="#2.2">跳过这段</a>，因为这部分<del>又长又臭</del>还不常用。</strong> <br><br>绝大部分的问题用<a href="#2.1">上述方法</a>和<a href="#2.2">绝对值的几何意义</a>就可以解决，但有时候，我们会遇到像$|2x|+|x+1|-|2x-1|=2$一样的无赖式子</p>
<ol>
<li><p>零点<br><br>找零点很简单，只需要令绝对值里面的式子等于零就可以了。</p>
<p>例如：</p>
<ol>
<li><blockquote>
<p>$|2x|$<br><br>$ 零点：2x=0$<br><br>$<del>~</del><del>~</del>~~x=0$</p>
</blockquote>
</li>
<li><blockquote>
<p>$|x+1|$<br><br>零点：$x+1=0$<br><br>$<del>~</del><del>~</del><del>~</del>~~x=-1$</p>
</blockquote>
</li>
<li><blockquote>
<p>$|2x-1|$<br><br>零点：$2x-1=0$<br><br>$<del>~</del><del>~</del><del>~</del><del>2x=1$<br><br>$</del><del>~</del><del>~</del><del>~</del>~~x=\frac{1}{2}$</p>
</blockquote>
</li>
</ol>
</li>
<li><p>分段<br><br>$n$ 个零点会分出 $(n+1)$ 段。<br><br><strong>注意分段要不要包括零点</strong></p>
<p>还是用那个例子，3个零点，分出了4段：</p>
<ol>
<li>$x&lt;-1$</li>
<li>$-1\le x&lt;0$</li>
<li>$0\le x&lt;\frac{1}{2}$</li>
<li>$\frac{1}{2}\le x$</li>
</ol>
</li>
<li><p>判断正负<br><br><del>需要一些不等式的知识</del><br><br>其实我们可以找个数代进去看看，<strong>还是要注意包不包括零点。</strong> 当然，这种东西就不要写在答卷上啦！</p>
<p>举个栗子：</p>
<blockquote>
<p>$-1\le x&lt;0$<br><br>包括零点 $-1$，所以算到 $x+1$ 的时候要注意一下。</p>
<p>找个数：$-\frac{1}{2}$</p>
<ol>
<li>$2x=2\times(-\frac{1}{2})=-1&lt;0\rightarrow 2x&lt;0$ </li>
<li>$x+1=-\frac{1}{2}+1=\frac{1}{2}&gt;0\rightarrow x+1\ge0$ <br><br><strong>注意啦！这里包括零点，所以要加等于号!</strong></li>
<li>$2x-1=2\times(-\frac{1}{2})-1=-2\rightarrow 2x-1&lt;0$</li>
</ol>
</blockquote>
</li>
<li><p>刻在DNA里的绝对值化简</p>
<blockquote>
<p>若 $-1\le x&lt;0$<br><br>$2x&lt;0, x+1\ge0, 2x-1&lt;0$<br><br>$\therefore 原式=-2x+x+1+2x-1=x$</p>
</blockquote>
</li>
<li><p>小心有坑！<br><br>相信看完上一段之后，有些小伙伴会兴奋起来：$x=2$ ! <br><br>.<br><br>.<br><br>.<br><br>.<br><br>.<br><br>.<br><br>是吗？<br><br>$-1\le x&lt;0$ 感觉自己被抛弃了……<br></p>
<p>没错！虽然这个结果很漂亮，但我们必须得：<br><br><span style="font-size: 36px">不适，舍去</span><br><br><span style="color: lightgrey">说实话，这个例子是我随便写的，真没想到这么好</span></p>
</li>
</ol>
<p>现在，把这题做完吧。用鼠标划下一行显示答案：<br><br><span style="color: white">$x=-4或x=\frac{2}{5}$</span></p>
<h3 id="2-2-绝对值的几何意义"><a href="#2-2-绝对值的几何意义" class="headerlink" title="2.2 绝对值的几何意义"></a>2.2 绝对值的几何意义</h3><p>今天先不写了，明天再更吧，诶嘿</p>
```

:::

