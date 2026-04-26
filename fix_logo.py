import glob
import re

tiktok_url = "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/7ea036484e0307e54f056d37651a140f~c5_100x100.jpeg?lk3s=a5d48078&nonce=29424&refresh_token=667954e3d555c4d693ea937e0e7a7590&x-expires=1777258800&x-signature=8J4%2F3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F"

for file in glob.glob("*.html"):
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We replace: src="assets/logo.png" with src="TIKTOK_URL"
    new_content = content.replace('src="assets/logo.png"', f'src="{tiktok_url}"')
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(new_content)

print("Updated HTML files to use TikTok logo URL.")
