import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
    { icon: "carbon:home", text: '首页', link: '/' },
    { icon: "carbon:blog", text: '博客', link: '/blog/' },
    { icon: "carbon:tag-group", text: '标签', link: '/blog/tags/' },
    { icon: "carbon:list", text: '归档', link: '/blog/archives/' },

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
        text: "FFPS",
        items: [
            { icon: "carbon:function-math", text: "FFMP", link: "/series/FFMP/FFMP-20240926" },
        ],
    }
    
])
