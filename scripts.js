// ===== Supabase Auth Config =====
// Replace with your Supabase project URL and anon key
const SUPABASE_URL = 'https://bhsvvdvmouyqdxmelfoe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoc3Z2ZHZtb3V5cWR4bWVsZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODE2MjAsImV4cCI6MjA2Mjc1NzYyMH0.DN-j5nROKlicHL7tyLi-BokDpaZMlrR6rSdKq39If9Q';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== Auth Modal Logic =====
const authModal = document.getElementById('auth-modal');
const closeAuth = document.getElementById('close-auth');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userMenu = document.getElementById('user-menu');
const userEmail = document.getElementById('user-email');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const authMsg = document.getElementById('auth-msg');
const authModalTitle = document.getElementById('auth-modal-title');

function openAuthModal(login=true) {
    authModal.classList.add('open');
    if (login) {
        loginForm.style.display = '';
        signupForm.style.display = 'none';
        authModalTitle.textContent = 'Entrar';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = '';
        authModalTitle.textContent = 'Criar Conta';
    }
    authMsg.textContent = '';
}
function closeAuthModal() {
    authModal.classList.remove('open');
    loginForm.reset();
    signupForm.reset();
    authMsg.textContent = '';
}
loginBtn.onclick = () => openAuthModal(true);
logoutBtn.onclick = async () => {
    await supabase.auth.signOut();
    updateUserUI(null);
};
closeAuth.onclick = closeAuthModal;
showSignup.onclick = (e) => {e.preventDefault(); openAuthModal(false);};
showLogin.onclick = (e) => {e.preventDefault(); openAuthModal(true);};
window.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuthModal();
});

loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const {error, data} = await supabase.auth.signInWithPassword({email, password});
    if (error) {
        authMsg.textContent = error.message;
    } else {
        closeAuthModal();
        updateUserUI(data.user);
    }
};
signupForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const {error, data} = await supabase.auth.signUp({
        email,
        password,
        options: { shouldCreateUserSession: true }
    });
    if (error) {
        authMsg.textContent = error.message;
    } else {
        closeAuthModal();
        updateUserUI(data.user);
    }
};

function updateUserUI(user) {
    if (user && user.email) {
        userEmail.textContent = user.email;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = '';
    } else {
        userEmail.textContent = '';
        loginBtn.style.display = '';
        logoutBtn.style.display = 'none';
    }
}

// On page load, check session
supabase.auth.getSession().then(({data}) => {
    updateUserUI(data.session?.user);
});
supabase.auth.onAuthStateChange((_event, session) => {
    updateUserUI(session?.user);
});

// ===== FIM Supabase Auth =====

// Menu hambúrguer
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.getElementById('nav-links');
menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Ebooks fictícios por categoria
const ebooks = [
    {
        titulo: 'Python Essencial',
        categoria: 'programacao',
        descricao: 'Aprenda Python do zero ao avançado com exemplos práticos.',
        preco: 'R$ 29,90',
        precoNum: 29.90,
        img: 'https://placehold.co/150x220/3b2f5c/ffffff?text=Python+Essencial'
    },
    {
        titulo: 'JavaScript Pro',
        categoria: 'programacao',
        descricao: 'Domine JavaScript e desenvolva aplicações web modernas.',
        preco: 'R$ 34,90',
        precoNum: 34.90,
        img: 'https://placehold.co/150x220/2d1b3b/ffffff?text=JavaScript+Pro'
    },
    {
        titulo: 'UX Design',
        categoria: 'design',
        descricao: 'Descubra os segredos do design de experiência do usuário.',
        preco: 'R$ 24,90',
        precoNum: 24.90,
        img: 'https://placehold.co/150x220/4e3ca9/ffffff?text=UX+Design'
    },
    {
        titulo: 'Marketing Digital',
        categoria: 'marketing',
        descricao: 'Estratégias práticas para alavancar seu negócio online.',
        preco: 'R$ 19,90',
        precoNum: 19.90,
        img: 'https://placehold.co/150x220/3b2f5c/ffffff?text=Marketing+Digital'
    }
];

// Função para criar HTML de um ebook-card com botão de adicionar ao carrinho
function ebookCardHTML(e) {
    return `
        <div class="ebook-card">
            <img src="${e.img}" alt="${e.titulo}">
            <h2>${e.titulo}</h2>
            <p>${e.descricao}</p>
            <span class="preco">${e.preco}</span>
            <button class="add-cart-btn" data-titulo="${e.titulo}">Adicionar ao Carrinho</button>
        </div>
    `;
}

// Atualizar grid da home para incluir botões de adicionar ao carrinho
document.querySelectorAll('.ebooks-grid').forEach(grid => {
    if (grid.closest('#home')) {
        const html = ebooks.map(ebookCardHTML).join('');
        grid.innerHTML = html;
    }
});

// Filtrar ebooks por categoria
const categoriaBtns = document.querySelectorAll('.categoria-btn');
const categoriaEbooks = document.getElementById('categoria-ebooks');
categoriaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-categoria');
        const filtrados = ebooks.filter(e => e.categoria === cat);
        categoriaEbooks.innerHTML = filtrados.map(ebookCardHTML).join('');
        attachAddToCartEvents();
    });
});

// Carrinho de compras
let cart = [];
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotalValue = document.getElementById('cart-total-value');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutMsg = document.getElementById('checkout-msg');

function updateCartCount() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.qtd, 0);
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Seu carrinho está vazio.</p>';
        cartTotalValue.textContent = 'R$ 0,00';
        return;
    }
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span class="cart-item-title">${item.titulo}</span>
            <span>x${item.qtd}</span>
            <span>${item.preco}</span>
            <button class="cart-item-remove" data-titulo="${item.titulo}">Remover</button>
        </div>
    `).join('');
    cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const titulo = this.getAttribute('data-titulo');
            cart = cart.filter(item => item.titulo !== titulo);
            updateCartCount();
            renderCart();
        });
    });
    const total = cart.reduce((sum, item) => sum + item.precoNum * item.qtd, 0);
    cartTotalValue.textContent = total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
}

function attachAddToCartEvents() {
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const titulo = this.getAttribute('data-titulo');
            const ebook = ebooks.find(e => e.titulo === titulo);
            const item = cart.find(i => i.titulo === titulo);
            if (item) {
                item.qtd += 1;
            } else {
                cart.push({
                    titulo: ebook.titulo,
                    preco: ebook.preco,
                    precoNum: ebook.precoNum,
                    qtd: 1
                });
            }
            updateCartCount();
            renderCart();
        });
    });
}

// Inicializar botões de adicionar ao carrinho na home e categorias
attachAddToCartEvents();

// ===== Lógica do formulário de contato =====
const contatoSection = document.getElementById('contato');
const contatoForm = document.getElementById('contato-form');
const contatoMsg = document.getElementById('contato-msg');

// Exibir formulário ao clicar em "Me Contate" no menu, se houver
const contatoNavBtn = document.querySelector('a[href="#contato"], button[href="#contato"]');
if (contatoNavBtn) {
    contatoNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        contatoSection.scrollIntoView({behavior: 'smooth'});
        contatoForm.style.display = '';
        contatoMsg.textContent = '';
    });
}

// Ocultar mensagem ao focar em qualquer campo do formulário
Array.from(contatoForm.elements).forEach(el => {
    el.addEventListener('focus', () => contatoMsg.textContent = '');
});

contatoForm.onsubmit = function(e) {
    e.preventDefault();
    contatoMsg.textContent = 'Mensagem enviada! Obrigado pelo contato.';
    contatoForm.reset();
    // Opcional: esconder o formulário após envio
    // contatoForm.style.display = 'none';
};

cartIcon.addEventListener('click', () => {
    cartModal.classList.add('open');
    renderCart();
    checkoutMsg.textContent = '';
});
closeCart.addEventListener('click', () => {
    cartModal.classList.remove('open');
});
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('open');
    }
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        checkoutMsg.textContent = 'Adicione algum eBook ao carrinho!';
        return;
    }
    cart = [];
    updateCartCount();
    renderCart();
    checkoutMsg.textContent = 'Compra finalizada com sucesso! Obrigado.';
});

// Formulário de contato (simulado)

