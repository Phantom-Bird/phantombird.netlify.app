import { defineThemeConfig } from 'vuepress-theme-plume'
import { navbar } from './navbar'
// import { notes } from './notes'

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
    logo: 'https://theme-plume.vuejs.press/plume.png',
    // your git repo url
    docsRepo: '',
    docsDir: 'docs',

    appearance: true,

    profile: {
        avatar: 'avatar.png',
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
