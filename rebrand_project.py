import glob
import os

old_name = "inkduo"
old_name_cap = "Inkduo"
new_name = "Livraria Novos Destinos"

for file_path in glob.glob("*.html") + ["styles.css", "script.js"]:
    if os.path.isfile(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        new_content = content.replace(old_name, new_name)
        new_content = new_content.replace(old_name_cap, new_name)
        
        # Specific fix for the UI avatars URL which uses ink+duo
        new_content = new_content.replace("name=Ink+Duo", "name=Novos+Destinos")
        
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {file_path}")

print("Global Rebranding Complete.")
