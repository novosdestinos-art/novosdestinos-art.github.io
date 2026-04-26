import urllib.request
import re

req = urllib.request.Request(
    'https://www.picuki.com/profile/inkduo.oficial', 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    matches = re.findall(r'<img[^>]+src="([^"]+)"[^>]*class="profile-avatar-image', html)
    if not matches:
        matches = re.findall(r'<img[^>]+src="([^"]+)"[^>]*class="[^"]*avatar[^"]*"', html)

    if matches:
        img_url = matches[0]
        print(f"Found Instagram avatar: {img_url}")
        img_data = urllib.request.urlopen(img_url).read()
        with open('assets/logo.png', 'wb') as f:
            f.write(img_data)
        print("Success!")
    else:
        print("No matches found.")
except Exception as e:
    print(e)
