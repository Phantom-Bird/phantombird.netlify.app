import { SidebarMulti, SidebarItem } from "vuepress-theme-plume";

const auto: {items: 'auto'} = {items: 'auto'};

export const sidebar: SidebarMulti = {
    '/series/FFMP/': auto,
    '/series/MC/': [
        'MC-doc-head',
        'MC-doc',
        'MC-doc-QA'
    ],
    '/series/vuepress/': [
        'build-guide',
        'markdown-guide',
        'useful-html'
    ],
}