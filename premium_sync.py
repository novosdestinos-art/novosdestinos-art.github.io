import os
import glob
import re

def sync_premium_ui():
    html_files = glob.glob("*.html")
    
    # 1. Header with Official Logo (Large)
    header_pattern = r'<header id="header">.*?</header>'
    new_header = '''<header id="header">
        <div class="container">
            <nav>
                <a href="index.html" class="logo-wrapper">
                    <img src="assets/logo.png" class="logo-icon" alt="Livraria Novos Destinos Logo">
                </a>
                <ul class="nav-menu">
                    <li><a href="index.html">Catálogo</a></li>
                    <li><a href="autores.html">Autores</a></li>
                    <li><a href="servicos.html">Serviços</a></li>
                    <li><a href="publique.html">Publique Conosco</a></li>
                </ul>
                <div class="nav-actions">
                    <button class="btn-cart" id="openCart">
                        <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        <span class="cart-badge" id="cartCount">0</span>
                    </button>
                    <button class="mobile-menu-toggle" id="mobileMenuToggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>
        </div>
    </header>'''

    # 2. Footer with Official Logo
    footer_pattern = r'<footer>.*?</footer>'
    new_footer = '''<footer>
        <div class="container">
            <div class="footer-content">
                <div>
                    <a href="index.html" class="logo-wrapper" style="margin-bottom: 1.5rem;">
                        <img src="assets/logo.png" class="logo-icon" alt="Livraria Novos Destinos Logo" style="width: 180px;">
                    </a>
                    <p style="max-width: 300px; color: var(--ink-light); font-size:0.95rem;">Transformando narrativas excepcionais em destinos literários únicos. Uma curadoria dedicada ao crescimento através da leitura.</p>
                </div>
                
                <div class="footer-links">
                    <h4>Conecte-se</h4>
                    <ul>
                        <li><a href="https://www.instagram.com/livrarianovosdestinos" target="_blank">Instagram</a></li>
                        <li><a href="https://www.tiktok.com/@livrarianovosdestinos" target="_blank">TikTok</a></li>
                    </ul>
                </div>

                <div class="footer-links">
                    <h4>Explorar</h4>
                    <ul>
                        <li><a href="index.html">Catálogo</a></li>
                        <li><a href="autores.html">Autores</a></li>
                        <li><a href="servicos.html">Serviços</a></li>
                        <li><a href="publique.html">Publique Conosco</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                &copy; 2026 Livraria Novos Destinos. Curadoria Literária & Destinos Únicos.
            </div>
        </div>
    </footer>'''

    # 3. Add Lenis and Scripts
    scripts_pattern = r'<!-- JS Externo -->.*?</body>'
    new_scripts = '''<!-- JS Externo -->
    <script src="https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
    <script src="script.js"></script>
</body>'''

    # 4. Update specific page elements
    # Add Price to book cards in index.html if not present
    
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Apply Header
        content = re.sub(header_pattern, new_header, content, flags=re.DOTALL)
        
        # Apply Footer
        content = re.sub(footer_pattern, new_footer, content, flags=re.DOTALL)
        
        # Apply Scripts
        content = re.sub(scripts_pattern, new_scripts, content, flags=re.DOTALL)
        
        # Ensure correct Logo link in head
        content = re.sub(r'<link rel="icon".*?>', '<link rel="icon" type="image/png" href="assets/logo.png">', content)
        content = re.sub(r'<link rel="apple-touch-icon".*?>', '<link rel="apple-touch-icon" href="assets/logo.png">', content)

        # Remove round-logo class if found
        content = content.replace('round-logo', '')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Synced {file}")

if __name__ == "__main__":
    sync_premium_ui()
