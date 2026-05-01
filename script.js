document.addEventListener('DOMContentLoaded', function() {

    // ===== LENIS SMOOTH SCROLL =====
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({ lerp: 0.08, smooth: true });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => document.body.classList.add('loaded'), 500);
        });
        setTimeout(() => document.body.classList.add('loaded'), 3000);
    }

    // ===== SCROLL PROGRESS BAR =====
    const progressBar = document.getElementById('scroll-progress');
    const backTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (progressBar) progressBar.style.width = (scrolled / maxScroll * 100) + '%';
        if (backTop) backTop.classList.toggle('visible', scrolled > 400);
    }, { passive: true });
    if (backTop) backTop.addEventListener('click', () => {
        if (lenis) lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== HEADER SCROLL =====
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    // ===== MOBILE MENU =====
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        navMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ===== REVEAL ON SCROLL =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach((el, i) => {
        if (el.closest('.store-grid, .reviews-grid, .footer-content')) {
            el.style.transitionDelay = (i * 80) + 'ms';
        }
        observer.observe(el);
    });

    // ===== CART SYSTEM =====
    const cartData = JSON.parse(localStorage.getItem('nd_cart') || '[]');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const openCartBtn = document.getElementById('openCart');
    const closeCartBtn = document.getElementById('closeCart');

    function openCart() {
        if (cartDrawer) cartDrawer.classList.add('open');
        if (cartOverlay) cartOverlay.classList.add('open');
        document.body.classList.add('cart-open');
        renderCart();
    }
    function closeCart() {
        if (cartDrawer) cartDrawer.classList.remove('open');
        if (cartOverlay) cartOverlay.classList.remove('open');
        document.body.classList.remove('cart-open');
    }
    if (openCartBtn) openCartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    window.addToCart = function(title, price, link, img) {
        cartData.push({ title, price: parseFloat(price), link, img: img || 'assets/logo.png' });
        localStorage.setItem('nd_cart', JSON.stringify(cartData));
        updateCartCount();
        showToast('\u201c' + title + '\u201d adicionado ao carrinho!');
    };

    window.removeFromCart = function(index) {
        cartData.splice(index, 1);
        localStorage.setItem('nd_cart', JSON.stringify(cartData));
        renderCart();
        updateCartCount();
    };

    window.processCheckout = function() {
        if (!cartData.length) return;
        if (cartData.length === 1) {
            window.location.href = cartData[0].link;
        } else {
            const list = cartData.map(i => '\u2022 ' + i.title + ' (R$ ' + i.price.toFixed(2).replace('.',',') + ')').join('%0A');
            const msg = 'Ol\u00e1! Gostaria de comprar:%0A' + list + '%0A%0AComo posso finalizar?';
            window.open('https://wa.me/5511999999999?text=' + msg, '_blank');
        }
    };

    function renderCart() {
        const body = document.getElementById('cartBody');
        const total = document.getElementById('cartTotalValue');
        const btn = document.getElementById('checkoutBtn');
        if (!body) return;
        if (!cartData.length) {
            body.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:200px;gap:1rem;text-align:center;"><svg style="width:48px;height:48px;stroke:#ddd;fill:none;" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg><h4 class="serif" style="color:var(--ink-light);font-size:1.2rem;">Carrinho vazio</h4><a href="index.html#store" style="color:var(--accent-gold);font-size:0.9rem;">Ver cat\u00e1logo</a></div>`;
            if (btn) { btn.disabled = true; btn.style.opacity = '0.5'; btn.textContent = 'Finalizar Compra'; }
            if (total) total.textContent = 'R$ 0,00';
            return;
        }
        let html = '', sum = 0;
        cartData.forEach((item, i) => {
            sum += item.price;
            html += `<div class="cart-item-row"><img src="${item.img}" class="cart-item-img" alt="Capa"><div class="cart-item-info"><span class="cart-item-title">${item.title}</span><span class="cart-item-price">R$ ${item.price.toFixed(2).replace('.',',')}</span><span class="cart-item-remove" onclick="removeFromCart(${i})">Remover</span></div></div>`;
        });
        body.innerHTML = html;
        if (total) total.textContent = 'R$ ' + sum.toFixed(2).replace('.',',');
        if (btn) {
            btn.disabled = false; btn.style.opacity = '1';
            btn.textContent = cartData.length === 1 ? 'Comprar Agora' : 'Finalizar via WhatsApp';
        }
    }

    function updateCartCount() {
        const el = document.getElementById('cartCount');
        if (el) el.textContent = cartData.length;
    }

    function showToast(msg) {
        const toast = document.getElementById('toastMessage');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3200);
    }

    updateCartCount();

    // ===== REVIEW SYSTEM =====
    const REVIEWS_KEY = 'nd_reviews_v1';

    function getReviews(bookId) {
        const all = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}');
        return all[bookId] || [];
    }

    function saveReview(bookId, review) {
        const all = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}');
        if (!all[bookId]) all[bookId] = [];
        all[bookId].unshift(review);
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
    }

    window.initReviews = function(bookId) {
        const grid = document.getElementById('reviewsGrid');
        const form = document.getElementById('reviewForm');
        const starPicker = document.getElementById('starPicker');
        if (!grid || !form) return;

        let selectedStars = 0;

        if (starPicker) {
            starPicker.innerHTML = '';
            for (let i = 1; i <= 5; i++) {
                const s = document.createElement('span');
                s.textContent = '\u2605';
                s.dataset.val = i;
                s.addEventListener('mouseover', () => highlightStars(i));
                s.addEventListener('mouseout', () => highlightStars(selectedStars));
                s.addEventListener('click', () => { selectedStars = i; highlightStars(i); });
                starPicker.appendChild(s);
            }
        }

        function highlightStars(n) {
            if (!starPicker) return;
            starPicker.querySelectorAll('span').forEach((s, i) => {
                s.classList.toggle('active', i < n);
            });
        }

        function renderReviews() {
            const reviews = getReviews(bookId);
            if (!reviews.length) {
                grid.innerHTML = `<div class="reviews-empty"><svg viewBox="0 0 24 24" fill="none"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg><p>Seja o primeiro a avaliar. Sua opini\u00e3o \u00e9 muito importante!</p></div>`;
                return;
            }
            grid.innerHTML = reviews.map(r => `
                <div class="review-card">
                    <div class="review-stars">${'\u2605'.repeat(r.stars)}${'<span style="color:#ddd">\u2605</span>'.repeat(5 - r.stars)}</div>
                    <p class="review-text">\u201c${r.text}\u201d</p>
                    <div class="review-author">
                        <span class="review-name">${r.name}</span>
                        <span class="review-date">${r.date}</span>
                    </div>
                </div>
            `).join('');
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('reviewName').value.trim();
            const text = document.getElementById('reviewText').value.trim();
            if (!name || !text || !selectedStars) {
                alert('Por favor, preencha todos os campos e selecione uma nota.');
                return;
            }
            const now = new Date();
            const date = now.toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' });
            saveReview(bookId, { name, text, stars: selectedStars, date });
            renderReviews();
            form.reset();
            selectedStars = 0;
            highlightStars(0);
            showToast('Obrigado pela sua avalia\u00e7\u00e3o! \u2764');
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        renderReviews();
    };

    // Auto-init if review container exists on page
    const reviewSection = document.getElementById('reviewsGrid');
    if (reviewSection && reviewSection.dataset.book) {
        window.initReviews(reviewSection.dataset.book);
    }

    // ===== COOKIE CONSENT =====
    if (!localStorage.getItem('nd_cookie_consent')) {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <p>Utilizamos cookies essenciais para o funcionamento do carrinho e para salvar suas avalia\u00e7\u00f5es. Seus dados nunca s\u00e3o compartilhados. <strong>LGPD compliant.</strong></p>
            <div class="btn-group">
                <button class="btn btn-primary" id="acceptCookies">Entendido</button>
                <a href="privacidade.html" class="btn btn-outline">Pol\u00edtica de Privacidade</a>
            </div>
        `;
        document.body.appendChild(banner);
        setTimeout(() => banner.classList.add('active'), 2500);
        banner.querySelector('#acceptCookies').addEventListener('click', () => {
            localStorage.setItem('nd_cookie_consent', 'true');
            banner.classList.remove('active');
            setTimeout(() => banner.remove(), 700);
        });
    }

    // ===== THEME TOGGLE (LIGHT/DARK MODE) =====
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    function setTheme(isDark) {
        if(isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            if(themeIcon) themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
            localStorage.setItem('nd_theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            if(themeIcon) themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
            localStorage.setItem('nd_theme', 'light');
        }
    }

    const savedTheme = localStorage.getItem('nd_theme') || 'dark'; // Defaults to dark
    setTheme(savedTheme === 'dark');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            setTheme(!isDark);
        });
    }

});
