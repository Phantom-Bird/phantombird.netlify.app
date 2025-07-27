import { defineThemeConfig } from 'vuepress-theme-plume'
import { navbar } from './navbar'
import { sidebar } from './sidebar'
import { notes } from './notes' 

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
    logo: 'plume.svg',
    // your git repo url
    docsRepo: 'https://github.com/Phantom-Bird/phantombird.netlify.app',
    docsBranch: 'master',
    docsDir: 'docs',

    sidebar, 
    // notes, 

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
