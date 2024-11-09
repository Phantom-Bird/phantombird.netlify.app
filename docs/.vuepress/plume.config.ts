import { defineThemeConfig } from 'vuepress-theme-plume'
import { navbar } from './navbar'
import { sidebar } from './sidebar'

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
    logo: 'plume.svg',
    // your git repo url
    docsRepo: 'https://gitee.com/phantombird/phantombird-site-src',
    docsBranch: 'master',
    docsDir: 'docs',

    sidebar,

    appearance: true,

    profile: {
        avatar: '/avatar.png',
        name: 'Phantom Bird',
        description: '你好',
        circle: true,
        // location: '',
        // organization: '',
    },

    autoFrontmatter: {
        permalink: false,
        createTime: false,
        title: false
    },

    navbar,
    social: [
        // { icon: 'github', link: '/' },
    ],

})
