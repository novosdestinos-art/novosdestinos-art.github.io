// Global Scripts for Inkduo
document.addEventListener("DOMContentLoaded", () => {
    // Header Effect
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

    // Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    revealElements.forEach(el => revealObserver.observe(el));

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

    // Form feedback
    const authorForm = document.getElementById('authorForm');
    if (authorForm) {
        authorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('A Inkduo recebeu os detalhes da sua publicação! Em breve a nossa equipe editorial fará contato pelo e-mail informado.');
            e.target.reset();
        });
    }

    // Smart Native Cart Logic
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    
    // Check if cart exists on this page
    if (cartDrawer && cartOverlay) {
        let cartItems = JSON.parse(localStorage.getItem('inkduo_cart')) || [];
        
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
            localStorage.setItem('inkduo_cart', JSON.stringify(cartItems));
            
            const toast = document.getElementById('toastMessage');
            if(toast) {
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            }
            
            updateCartCount();
        };

        window.removeFromCart = function(index) {
            cartItems.splice(index, 1);
            localStorage.setItem('inkduo_cart', JSON.stringify(cartItems));
            renderCart();
            updateCartCount();
        };

        window.processCheckout = function() {
            if(cartItems.length === 0) return;
            
            if(cartItems.length === 1) {
                // Route natively to Kiwify if only 1 item
                window.location.href = cartItems[0].kiwifyLink;
            } else {
                // Route to WhatsApp if multiple items
                const phone = "5511999999999"; // Change to real phone if provided
                const message = encodeURIComponent(`Olá Inkduo! Gostaria de finalizar a compra do combo com ${cartItems.length} livros. Os títulos são: \n${cartItems.map(i => '- ' + i.title).join('\n')}`);
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
    }
});
