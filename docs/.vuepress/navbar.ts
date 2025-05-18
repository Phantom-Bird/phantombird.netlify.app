import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
    { icon: "carbon:home", text: '首页', link: '/' },

    { 
        icon: "carbon:blog",
        text: '博客',
        items: [
            { icon: "carbon:list", text: '列表', link: '/blog/' },
            { icon: "carbon:time", text: '归档', link: '/blog/archives/' },
            { icon: "carbon:folder", text: '分类', link: '/blog/categories/' },
            { icon: "carbon:tag-group", text: '标签', link: '/blog/tags/' },
        ]
    },

    {
        icon: "carbon:document",
        text: "文档",
        items: [
            { icon: "carbon:cube", text: "MC", link: "/series/MC/MC-doc" },
            { icon: "carbon:blog", text: "vuepress 指南", link: "/series/vuepress/markdown-guide" },
        ],
    },
    {
        icon: "carbon:document-blank",
        text: "题集",
        items: [
            { icon: "carbon:function-math", text: "FFMP", link: "/series/FFMP/An-intro" },
        ],
    }
    
])
