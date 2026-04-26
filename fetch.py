import urllib.request
import re

urls = [
    "https://pay.kiwify.com.br/N6Gx2Id",
    "https://pay.kiwify.com.br/H8BCVHa",
    "https://pay.kiwify.com.br/gqoaa2m",
    "https://pay.kiwify.com.br/sLSFv64"
]

req_headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for u in urls:
    try:
        req = urllib.request.Request(u, headers=req_headers)
        html = urllib.request.urlopen(req).read().decode('utf-8')
        # match og:image exactly
        match = re.search(r'<meta\s+(?:property|name)=[\'"]og:image[\'"]\s+content=[\'"]([^\'"]+)[\'"]', html)
        if match:
            print(f"{u} -> {match.group(1)}")
        else:
            print(f"{u} -> none")
    except Exception as e:
        print(f"{u} -> Error: {e}")
