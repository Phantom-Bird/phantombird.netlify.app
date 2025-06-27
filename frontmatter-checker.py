import os
import yaml
import glob

def get_ignore(frontmatter):
    lines = frontmatter.splitlines()
    for line in lines:
        line = line.strip()
        
        if not line.startswith('#'):
            continue
        
        line = line[1:].lstrip()
        if not line.startswith('^'):
            continue
        
        for i in line[1:].split(','):
            yield i.strip()

def check_frontmatter(directory, required_fields):
    md_files = glob.glob(os.path.join(directory, '**/*.md'), recursive=True)
    
    for md_file in md_files:
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if not content.startswith('---'):
            print(f'文件 {md_file} 没有 frontmatter')
            
        parts = content.split('---')
        if len(parts) < 3:
            print(f'文件 {md_file} 的 frontmatter 没有结束')

        frontmatter = parts[1]
        try:
            metadata = yaml.safe_load(frontmatter)
            if metadata is None:
                print(f'文件 {md_file} 有空的 frontmatter 块')
                continue
            
            ignored_fields = list(get_ignore(frontmatter))
            
            missing_fields = []
            for field in required_fields:
                if field not in metadata and field not in ignored_fields:
                    missing_fields.append(field)
            
            if missing_fields:
                print(f'文件 {md_file} 缺少以下 frontmatter 字段: {', '.join(missing_fields)}')
                
        except yaml.YAMLError as e:
            print(f'文件 {md_file} frontmatter YAML 解析错误: {e}')
            

if __name__ == '__main__':
    directory_to_check = './docs/blogs'
    
    required_fields = [
        'title',
        'createTime',
        'tags',
        'categories',
    ]
    
    if os.path.isdir(directory_to_check):
        check_frontmatter(directory_to_check, required_fields)
        print('frontmatter 检查完成')
    else:
        raise FileNotFoundError('指定的路径不是目录或不存在')
