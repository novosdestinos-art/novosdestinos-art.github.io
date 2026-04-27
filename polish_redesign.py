import glob
import os

for file_path in glob.glob("*.html"):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Remove redundant logo text next to the image
    new_content = content.replace('<span class="logo-text">Novos Destinos</span>', '')
    
    # Update alt text
    new_content = new_content.replace('alt="Inkduo Logo"', 'alt="Livraria Novos Destinos Logo"')
    
    # Update Hero text for a fresher discovery vibe
    new_content = new_content.replace('Histórias que marcam, publicações que <em>encantam</em>.', 'Descubra novos horizontes em cada <em>página</em>.')
    new_content = new_content.replace('Plataforma Editorial Integrada', 'Curadoria Literária & Destinos Únicos')
    new_content = new_content.replace('Curadoria Literária &amp; Destinos Únicos', 'Curadoria Literária & Destinos Únicos')

    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Polished {file_path}")

print("Polish Complete.")
