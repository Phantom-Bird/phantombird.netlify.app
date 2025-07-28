import { defineClientConfig } from 'vuepress/client'
import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
import Desktop from './custom/Desktop.vue'


export default defineClientConfig({
  enhance({ app }) {
    app.component('RepoCard', RepoCard)
    app.component('Desktop', Desktop)
  },
})
