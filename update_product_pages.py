import os
import re

files_to_update = [
    'livro-7-dias.html',
    'livro-arte-aco.html',
    'livro-auto-sabota.html',
    'livro-vazio-presenca.html'
]

# Read index.html to extract the latest header and footer
with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

header_match = re.search(r'(<header id="header">.*?</header>)', index_content, re.DOTALL)
footer_match = re.search(r'(<footer>.*?</footer>)', index_content, re.DOTALL)

if not header_match or not footer_match:
    print("Could not find header or footer in index.html")
    exit(1)

new_header = header_match.group(1)
new_footer = footer_match.group(1)

for filename in files_to_update:
    if not os.path.exists(filename):
        continue
        
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Add data-theme="dark" to html tag if missing
    content = re.sub(r'<html lang="pt-BR">', '<html lang="pt-BR" data-theme="dark">', content)
    
    # Replace header
    content = re.sub(r'<header id="header">.*?</header>', new_header, content, flags=re.DOTALL)
    
    # Replace footer
    content = re.sub(r'<footer>.*?</footer>', new_footer, content, flags=re.DOTALL)
    
    # Update Product Image to have the book-cover-wrapper
    # From: <div class="product-image reveal">\n<img src="URL" alt="TXT">\n</div>
    # To: <div class="product-image reveal">\n<div class="book-cover-wrapper">\n<img src="URL" alt="TXT" class="book-cover">\n</div>\n</div>
    def repl_img(m):
        inner_img = m.group(1)
        if 'class="book-cover"' not in inner_img:
            # Add class book-cover to img
            if 'class="' in inner_img:
                inner_img = re.sub(r'class="([^"]*)"', r'class="\1 book-cover"', inner_img)
            else:
                inner_img = inner_img.replace('<img ', '<img class="book-cover" ')
        return f'<div class="product-image reveal">\n<div class="book-cover-wrapper">\n{inner_img}\n</div>\n</div>'
        
    # Match product-image reveal and its img child.
    # Be careful, it might already have the wrapper
    if 'book-cover-wrapper' not in content:
        content = re.sub(r'<div class="product-image reveal">\s*(<img.*?>)\s*</div>', repl_img, content, flags=re.DOTALL)

    # Clean up inline styles on buttons that override the new design
    # Specifically: background: var(--accent-gold);
    content = re.sub(r'background:\s*var\(--accent-gold\);', '', content)
    
    # Ensure h1 uses Playfair explicitly if needed, but CSS handles it via h1 now.
    content = re.sub(r'font-family: [^;"]*;', '', content) # remove old inline font families

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print("Product pages updated successfully!")
