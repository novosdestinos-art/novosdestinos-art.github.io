import glob
import os

logo_local_path = "assets/logo.png"

for file in glob.glob("*.html"):
    with open(file, "r", encoding="utf-8") as f:
        html = f.read()
    
    # Replace the current TikTok CDN URL with the local logo path
    # The TikTok URL was: https://p16-sign-va.tiktokcdn.com/...
    # But to be safe, I'll search for any src="https://p16-sign-va..." and replace it.
    import re
    html = re.sub(r'src="https://p16-sign-va\.tiktokcdn\.com/[^"]+"', f'src="{logo_local_path}"', html)
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(html)

print("Updated Logo source to local assets/logo.png in all HTML files.")
