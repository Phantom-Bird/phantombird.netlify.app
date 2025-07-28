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
            pagination: 15,  // 每页显示的文章数量。禁用分页 - pagination: false,
            tagsTheme: 'brand',
        },

        editLink: true,
        editLinkPattern: ':repo/blob/:branch/:path?plain=1',
        editLinkText: '在 GitHub 上查看源代码',
        
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
                theme: 'one-light',
                // 强烈建议预设代码块高亮语言，插件默认加载所有语言会产生不必要的时间开销
                // languages: ['cpp', 'py', 'md', 'html', 'sh', 'yaml', 'ts', 'toml'],
            },
        },
    }),
})
