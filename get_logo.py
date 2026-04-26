import urllib.request
import re
import json

try:
    req = urllib.request.Request(
        'https://tcounts.com/tiktok/user/inkduobooks.oficial', 
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    html = urllib.request.urlopen(req).read().decode('utf-8')
    matches = re.findall(r'src="([^"]+p16-tiktokcdn[^"]+)"', html)
    if matches:
        print(f"Found logo: {matches[0]}")
        with open('assets/logo.jpg', 'wb') as f:
            f.write(urllib.request.urlopen(matches[0]).read())
        print("Success")
    else:
        # try another pattern
        matches = re.findall(r'<img[^>]+src="([^"]+)"[^>]+id="user-avatar"', html)
        if matches:
            print(f"Found logo: {matches[0]}")
            with open('assets/logo.jpg', 'wb') as f:
                f.write(urllib.request.urlopen(matches[0]).read())
            print("Success")
        else:
            print("Not found")

except Exception as e:
    print("Error:", e)
