// Global Scripts for Livraria Novos Destinos
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

document.addEventListener("DOMContentLoaded", () => {
    // 1. Lenis Smooth Scroll Initialization
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    })

    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // 2. Header Effect
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 3. Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        // Close menu when clicking links
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // 4. Advanced Scroll Reveal with Stagger
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Check if it's a grid item for staggering
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach((el, i) => {
        // Auto-stagger grid items if not manually set
        if (el.parentElement.classList.contains('store-grid') || el.parentElement.classList.contains('testimonial-grid')) {
            const indexInParent = Array.from(el.parentElement.children).indexOf(el);
            el.dataset.delay = indexInParent * 150;
        }
        revealObserver.observe(el);
    });

    // 5. Hero Parallax Effect
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            const content = hero.querySelector('.hero-content');
            if (content) {
                content.style.transform = `translateY(${scroll * 0.2}px)`;
                content.style.opacity = 1 - (scroll / 700);
            }
        });
    }

    // 6. Micro-interactions: Button Hover Effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            btn.style.setProperty('--x', `${x}px`);
            btn.style.setProperty('--y', `${y}px`);
        });
    });

    // FAQ Interactivity
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const parent = q.parentElement;
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== parent) item.classList.remove('active');
            });
            parent.classList.toggle('active');
        });
    });

    // Form feedback (WhatsApp Author Submission)
    const authorForm = document.getElementById('authorForm');
    if (authorForm) {
        authorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(authorForm);
            const name = authorForm.querySelector('input[type="text"]').value;
            const email = authorForm.querySelector('input[type="email"]').value;
            const stage = authorForm.querySelector('select').value;
            const synopsis = authorForm.querySelector('textarea').value;
            
            const phone = "5511999999999";
            const message = `Olá Livraria Novos Destinos! 👋%0A%0AGostaria de submeter um manuscrito para avaliação.%0A%0A*Nome:* ${name}%0A*E-mail:* ${email}%0A*Estágio:* ${stage}%0A*Sinopse:* ${synopsis}`;
            
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
            
            alert('Abertura de canal via WhatsApp realizada! Nossa equipe aguarda os detalhes.');
            authorForm.reset();
        });
    }

    // Smart Native Cart Logic
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    
    // Check if cart exists on this page
    if (cartDrawer && cartOverlay) {
        let cartItems = JSON.parse(localStorage.getItem('Livraria Novos Destinos_cart')) || [];
        
        const openCartBtn = document.getElementById('openCart');
        const closeCartBtn = document.getElementById('closeCart');
        
        if(openCartBtn) openCartBtn.addEventListener('click', openCartDrawer);
        if(closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
        cartOverlay.addEventListener('click', closeCartDrawer);

        function openCartDrawer() {
            cartDrawer.classList.add('open');
            cartOverlay.classList.add('open');
            document.body.classList.add('cart-open');
            renderCart();
        }

        function closeCartDrawer() {
            cartDrawer.classList.remove('open');
            cartOverlay.classList.remove('open');
            document.body.classList.remove('cart-open');
        }

        window.addToCart = function(itemTitle, itemPrice, kiwifyUrl, imgUrl) {
            cartItems.push({ title: itemTitle, price: parseFloat(itemPrice), kiwifyLink: kiwifyUrl, img: imgUrl || 'assets/placeholder.png' });
            localStorage.setItem('Livraria Novos Destinos_cart', JSON.stringify(cartItems));
            
            const toast = document.getElementById('toastMessage');
            if(toast) {
                toast.textContent = `${itemTitle} adicionado!`;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            }
            
            updateCartCount();
        };

        window.removeFromCart = function(index) {
            cartItems.splice(index, 1);
            localStorage.setItem('Livraria Novos Destinos_cart', JSON.stringify(cartItems));
            renderCart();
            updateCartCount();
        };

        window.processCheckout = function() {
            if(cartItems.length === 0) return;
            
            if(cartItems.length === 1) {
                window.location.href = cartItems[0].kiwifyLink;
            } else {
                const phone = "5511999999999"; 
                const bookList = cartItems.map(i => `• ${i.title}`).join('%0A');
                const message = `Olá Livraria Novos Destinos! 👋%0A%0AGostaria de adquirir o combo especial com ${cartItems.length} livros:%0A${bookList}%0A%0AComo posso finalizar o pagamento?`;
                window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
            }
        };

        function renderCart() {
            const cartBody = document.getElementById('cartBody');
            const cartTotalValue = document.getElementById('cartTotalValue');
            const cartCount = document.getElementById('cartCount');
            const checkoutBtn = document.getElementById('checkoutBtn');
            
            let total = 0;

            if(cartItems.length === 0) {
                cartBody.innerHTML = `
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
                        <svg style="width: 48px; height: 48px; stroke: #ccc; fill: none; margin-bottom: 1rem;" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        <h4 class="serif">Seu carrinho está vazio</h4>
                        <button class="btn btn-primary" style="margin-top: 2rem;" onclick="closeCartDrawer()">Explorar Livros</button>
                    </div>
                `;
                checkoutBtn.style.opacity = '0.5';
                checkoutBtn.disabled = true;
                checkoutBtn.textContent = "Finalizar Compra Segura";
            } else {
                let html = '<div style="width: 100%; text-align: left;">';
                cartItems.forEach((item, index) => {
                    total += item.price;
                    html += `
                        <div class="cart-item-row">
                            <img src="${item.img}" class="cart-item-img" alt="Capa">
                            <div class="cart-item-info">
                                <span class="cart-item-title">${item.title}</span>
                                <span class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                                <span class="cart-item-remove" onclick="removeFromCart(${index})">Remover</span>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
                cartBody.innerHTML = html;
                
                checkoutBtn.style.opacity = '1';
                checkoutBtn.disabled = false;
                
                // Intelligent label
                if (cartItems.length === 1) {
                    checkoutBtn.textContent = `Ir para Pagamento (Kiwify)`;
                } else {
                    checkoutBtn.textContent = `Finalizar Combo (WhatsApp)`;
                }
            }
            
            if(cartTotalValue) {
                cartTotalValue.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
            }
            updateCartCount();
        }
        
        function updateCartCount() {
            const countEl = document.getElementById('cartCount');
            if(countEl) countEl.textContent = cartItems.length;
        }

        updateCartCount();

        // Privacy / Cookie Consent
        function initCookieConsent() {
            if (!localStorage.getItem('cookie-consent')) {
                const banner = document.createElement('div');
                banner.className = 'cookie-banner';
                banner.innerHTML = `
                    <p>Valorizamos sua privacidade. Utilizamos cookies essenciais para garantir a melhor experiência e segurança dos seus dados conforme a LGPD.</p>
                    <div class="btn-group">
                        <button class="btn btn-primary" id="acceptCookies">Aceitar Tudo</button>
                        <a href="privacidade.html" class="btn btn-outline">Ver Política</a>
                    </div>
                `;
                document.body.appendChild(banner);
                setTimeout(() => banner.classList.add('active'), 2000);

                document.getElementById('acceptCookies').addEventListener('click', () => {
                    localStorage.setItem('cookie-consent', 'true');
                    banner.classList.remove('active');
                    setTimeout(() => banner.remove(), 600);
                });
            }
        }
        initCookieConsent();
    }
});
