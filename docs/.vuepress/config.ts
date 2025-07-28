import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import { rubyContainer } from './custom/ruby'
import {markdownMathPlugin} from '@vuepress/plugin-markdown-math'

export default defineUserConfig({
    // <魔改>

    head: [
        ['link', { rel: 'stylesheet', href: '/style.css' }]
    ],

    // </魔改>

    base: '/',
    lang: 'zh-CN',
    title: 'Phantom Bird',
    description: '',

    bundler: viteBundler(),

    plugins: [
        rubyContainer,
        markdownMathPlugin({
            type: 'katex',
            copy: true,
            mhchem: true,
        })
    ],

    theme: plumeTheme({
        hostname: 'https://phantombird.netlify.app',

        blog: {
            include: ['blogs/**/*.md'],
            exclude: ['.vuepress/', '**/README.md'],
            pagination: 15,
            tagsTheme: 'brand',
        },

        editLink: true,
        editLinkPattern: ':repo/blob/:branch/:path?plain=1',
        editLinkText: '在 GitHub 上查看源代码',

        footer: false,  // 似乎没有只在首页关闭的选项
        
        markdown: {
            demo: true,
            codeTree: true,
            math: {
                type: 'katex',
            },
            pdf: true,
            mermaid: true
        },

        plugins: {
            /**
             * Shiki 代码高亮
             * @see https://theme-plume.vuejs.press/config/plugins/code-highlight/
             */
            shiki: {
                themes: {
                    dark: 'one-dark-pro',
                    light: 'one-light'
                }
                // 强烈建议预设代码块高亮语言，插件默认加载所有语言会产生不必要的时间开销
                // languages: ['cpp', 'py', 'md', 'html', 'sh', 'yaml', 'ts', 'toml'],
            },
        },
    }),
})
