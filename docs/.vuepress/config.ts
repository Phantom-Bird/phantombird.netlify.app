import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import { rubyContainer } from './custom'


export default defineUserConfig({
    head: [
        ['link', { rel: 'stylesheet', href: '/style.css' }]
    ],
    base: '/',
    lang: 'zh-CN',
    title: 'Phantom Bird',
    description: '',

    bundler: viteBundler(),

    plugins: [
        rubyContainer
    ],

    theme: plumeTheme({
        

        // 添加您的部署域名
        hostname: 'https://phantombird.netlify.app',

        blog: {
            include: ['blogs/**/*.md'],
            exclude: ['.vuepress/', '**/README.md'],
            pagination: 15,  // 每页显示的文章数量。禁用分页 - pagination: false,
            tagsTheme: 'brand',
        },
        
        
        plugins: {
            /**
             * Shiki 代码高亮
             * @see https://theme-plume.vuejs.press/config/plugins/code-highlight/
             */
            shiki: {
                theme: 'one-light',
                // 强烈建议预设代码块高亮语言，插件默认加载所有语言会产生不必要的时间开销
                languages: ['cpp', 'py', 'md', 'html', 'sh', 'yaml', 'ts', 'toml'],
            },

            /**
             * markdown enhance
             * @see https://theme-plume.vuejs.press/config/plugins/markdown-enhance/
             */
            markdownEnhance: {
                demo: true,
            //   include: true,
            //   chart: true,
            //   echarts: true,
            //   mermaid: true,
            //   flowchart: true,
            },

            /**
             *  markdown power
             * @see https://theme-plume.vuejs.press/config/plugin/markdown-power/
             */
            // markdownPower: {
            //   pdf: true,
            //   caniuse: true,
            //   plot: true,
            //   bilibili: true,
            //   youtube: true,
            //   icons: true,
            //   codepen: true,
            //   replit: true,
            //   codeSandbox: true,
            //   jsfiddle: true,
            //   repl: {
            //     go: true,
            //     rust: true,
            //     kotlin: true,
            //   },
            // },

            /**
             * 评论 comments
             * @see https://theme-plume.vuejs.press/guide/features/comments/
             */
            // comment: {
            //   provider: '', // "Artalk" | "Giscus" | "Twikoo" | "Waline"
            //   comment: true,
            //   repo: '',
            //   repoId: '',
            //   categoryId: '',
            //   mapping: 'pathname',
            //   reactionsEnabled: true,
            //   inputPosition: 'top',
            // },
        },
    }),
})
