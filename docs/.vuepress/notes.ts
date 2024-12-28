import { defineUserConfig } from 'vuepress'
import { defineNoteConfig, plumeTheme, NotesOptions } from 'vuepress-theme-plume'

function link(x: string){
    return {'link': x};
}

// 坑？？：dir 不会与 notes.dir 合并
const FFMP = defineNoteConfig({
    dir: 'FFMP',
    link: '/FFMP/',
    sidebar: 'auto'
})

const MC = defineNoteConfig({
    dir: 'series/MC',
    link: '/MC/',
    sidebar: [
            ('MC-doc-head'),
            ('MC-doc'),
            ('MC-doc-QA')
        ]
})

const vuepress_guide = defineNoteConfig({
    dir: 'series/vuepress',
    link: '/vuepress/',
    sidebar: [
            ('build-guide'),
            ('markdown-guide'),
            ('useful-html')
        ]
})

export const notes: NotesOptions = {
    link: '/series/',
    dir: 'series',
    notes: [MC, FFMP, vuepress_guide], 
}