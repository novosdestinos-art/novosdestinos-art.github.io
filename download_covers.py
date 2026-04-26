import urllib.request
import re
import os

urls = {
    "vazio_presenca": "https://pay.kiwify.com.br/N6Gx2Id",
    "7_dias": "https://pay.kiwify.com.br/H8BCVHa",
    "auto_sabota": "https://pay.kiwify.com.br/gqoaa2m",
    "arte_aco": "https://pay.kiwify.com.br/sLSFv64"
}

req_headers = {'User-Agent': 'Mozilla/5.0'}

os.makedirs('assets', exist_ok=True)

for name, u in urls.items():
    try:
        req = urllib.request.Request(u, headers=req_headers)
        html = urllib.request.urlopen(req).read().decode('utf-8')
        
        # Procura a imagem hospeda na aws (cdn) ignorando versões resize
        # Kiwify usa "https://aws-assets.kiwify.com.br/{code}/..."
        matches = re.findall(r'https://aws-assets\.kiwify\.com\.br/[A-Za-z0-9_-]+/[^"\'?]+\.(?:jpeg|jpg|png)', html)
        
        # Filtras os URLs cdn-cgi/image (miniaturas) para pegar a original
        originals = [m for m in matches if 'cdn-cgi'  not in m]
        
        if originals:
            img_url = originals[0]
            extension = img_url.split('.')[-1]
            file_path = f"assets/{name}_original.{extension}"
            
            print(f"Downloading {name} from {img_url}...")
            # Download da imagem
            urllib.request.urlretrieve(img_url, file_path)
            print(f"Saved to {file_path}")
        else:
            print(f"[{name}] Original image not found.")
            
    except Exception as e:
        print(f"Error processing {name}: {e}")
