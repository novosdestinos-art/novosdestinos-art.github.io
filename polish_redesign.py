import glob
import os
import re
import sys

def robust_polish():
    print("Starting Robust Polish Redesign...")
    html_files = glob.glob("*.html")
    
    if not html_files:
        print("No HTML files found in current directory.")
        return

    # Patterns to match (case insensitive and flexible with spaces)
    replacements = [
        # Remove logo text span
        (r'<span class="logo-text">.*?</span>', ''),
        
        # Update alt text
        (r'alt="Inkduo Logo"', 'alt="Livraria Novos Destinos Logo"'),
        
        # Title Tags
        (r'<title>.*?</title>', '<title>Livraria Novos Destinos | Curadoria Literária & Destinos Únicos</title>'),
        
        # Hero text
        (r'Histórias que marcam, publicações que <em>encantam</em>\.', 'Descubra novos horizontes em cada <em>página</em>.'),
        (r'Plataforma Editorial Integrada', 'Curadoria Literária & Destinos Únicos'),
        (r'Curadoria Literária &amp; Destinos Únicos', 'Curadoria Literária & Destinos Únicos'),
        
        # Global Name update
        (r'Inkduobooks', 'Livraria Novos Destinos'),
        (r'Inkduo', 'Livraria Novos Destinos'),
    ]

    for file_path in html_files:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = content
            for pattern, subst in replacements:
                new_content = re.sub(pattern, subst, new_content, flags=re.IGNORECASE | re.DOTALL)
            
            if new_content != content:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"SUCCESS: {file_path}")
            else:
                pass
        except Exception as e:
            print(f"ERROR processing {file_path}: {e}")

if __name__ == "__main__":
    robust_polish()
    print("Polish Complete.")
