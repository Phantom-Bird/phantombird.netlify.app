import { markdownContainerPlugin } from '@vuepress/plugin-markdown-container'

const rp_tag = '@rp@'
const default_arg = ['', '(', ')'];

function get_args(s: string, i: number){
    const res = s.split(rp_tag)[i];
    if (res == undefined) {
        return default_arg[i];
    } 
    return res;
}

export const rubyContainer = markdownContainerPlugin({
    type: 'ruby',
    locales: {
        '/': {defaultInfo: ''}
    },
    before: (info: string): string => 
        `<ruby class="container-ruby">\n`,
    after: (info: string): string => 
        `<rp>${get_args(info, 1)}</rp>
        <rt>${get_args(info, 0)}</rt>
        <rp>${get_args(info, 2)}</rp></ruby>\n`,
})