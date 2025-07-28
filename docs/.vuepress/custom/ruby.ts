import { markdownContainerPlugin } from '@vuepress/plugin-markdown-container'

const rp_tag = '@rp'
const default_arg = ['', '(', ')'];

function get_arg(s: string, i: number){
    var li = s.split(rp_tag);
    
    if (li[i] == undefined) {
        return default_arg[i];
    } 
    return li[i];
}

export const rubyContainer = markdownContainerPlugin({
    type: 'ruby',
    before: (info: string): string => 
        `<ruby class="container-ruby">\n`,
    after: (info: string): string => 
        `<rp>${get_arg(info, 1)}</rp>
        <rt>${get_arg(info, 0)}</rt>
        <rp>${get_arg(info, 2)}</rp></ruby>\n`,
})