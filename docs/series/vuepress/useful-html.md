---
title: 一些 HTML 用法移植
---

## 写作……读作……
:::md-demo HTML
<ruby>写作<rp>（</rp><rt>读作</rt><rp>）</rp></ruby>
:::

::::md-demo Markown
:::ruby 读作
写作
:::

无缝衔接{.inline}

:::ruby 读作 @rp ( @rp )
写作
:::

其他 md 元素：

:::ruby lAtEx
$\LaTeX$
::::

:::details 实现
```typescript
import { markdownContainerPlugin } from '@vuepress/plugin-markdown-container'

const rp_tag = '@rp'
const default_arg = ['', '(', ')'];

function get_args(s: string, i: number){
    var li = s.split(rp_tag);
    
    if (li[i] == undefined) {
        return default_arg[i];
    } 
    return li[i];
}

export const rubyContainer = markdownContainerPlugin({
    type: 'ruby',
    before: (info: string): string => 
        `<ruby class="container-ruby">\n`,
    after: (info: string): string => 
        `<rp>${get_args(info, 1)}</rp>
        <rt>${get_args(info, 0)}</rt>
        <rp>${get_args(info, 2)}</rp></ruby>\n`,
})
```
:::
