import glob
import os
import re

for file_path in glob.glob("*.html"):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Remove any variation of Novos Destinos in logo-text span
    new_content = re.sub(r'<span class="logo-text">.*?</span>', '', content)
    
    # Ensure consistent Hero and Labels
    new_content = new_content.replace('Plataforma Editorial Integrada', 'Curadoria Literária & Destinos Únicos')
    new_content = new_content.replace('Histórias que marcam, publicações que <em>encantam</em>.', 'Descubra novos horizontes em cada <em>página</em>.')
    
    # Fix redundant mentions in sections
    new_content = new_content.replace('Pilar da Livraria Novos Destinos', 'Nossos Pilares Literários')
    
    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Final polish: {file_path}")

print("Site fully synchronized with the new brand.")
