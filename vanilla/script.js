// Product data
const products = [
    {
        id: 1,
        name: "3-Wheel Electric Bike",
        price: 60.000,
        description:"A sleek 250W men's electric bike with smooth shifting, made for city cruising.",
        category: "Electronics",
        image: "assets/image/bike1.jpg",
        rating: 4.5,
        inStock: true,
        featured: true
    },
    
    {
        id: 2,
        name: "Leonx Electronic Bike<",
        price: 14.000,
        description: "A sturdy electric trike for smooth, worry-free rides around town",
        category: "Electronics",
        image: "assets/image/bike2.jpg",
        rating: 4.7,
        inStock: true,
        featured: true
    },
    {
        id: 3,
        name: "Electric Mens Bike",
        price: 60.000,
        description: "Elegant genuine leather handbag with gold-tone hardware and multiple compartments.",
        image: "assets/image/bike3.jpg",
        rating: 4.4,
        inStock: true,
        featured: true
    },
    {
        id: 4,
        name: "Bianchi Bicycles",
        price: 22.000,
        description: "Legendary Italian cycles since 1885, famous for Celeste-colored precision-crafted road and e-bikes.",
        image: "assets/image/bike4.jpg",
        rating: 4.7,
        inStock: true,
        featured: true
    },
   
];

// DOM Elements
const featuredProductsContainer = document.getElementById('featured-products');
const newProductsContainer = document.getElementById('new-products');
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
const continueShoppingBtn = document.getElementById('continue-shopping');
const cartItemsContainer = document.getElementById('cart-items');
const cartSubtotalElement = document.getElementById('cart-subtotal');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.querySelector('.cart-count');
const hamburgerMenu = document.getElementById('hamburger-menu');
const mobileMenu = document.getElementById('mobile-menu');
const categoryCards = document.querySelectorAll('.category-card');
const productModal = document.getElementById('product-modal');
const modalOverlay = document.getElementById('modal-overlay');
const closeModal = document.getElementById('close-modal');
const modalBody = document.getElementById('modal-body');
const header = document.querySelector('header');

// Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
function init() {
    renderProducts();
    updateCartCount();
    setupEventListeners();
}

// Render products to the page
function renderProducts() {
    // Featured products
    const featuredProducts = products.filter(product => product.featured);
    featuredProductsContainer.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
    
}
// Create HTML for product card
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.originalPrice ? '<span class="product-badge">Sale</span>' : ''}
            </div>
            <div class="product-details">
                <div class="product-header">
                    <div>
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-category">${product.category}</div>
                    </div>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <span>${product.rating}</span>
                    </div>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    <i class="fas fa-shopping-bag"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Set up event listeners
function setupEventListeners() {
    // Toggle cart sidebar
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    continueShoppingBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    
    // Toggle mobile menu
    hamburgerMenu.addEventListener('click', toggleMobileMenu);
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
        }
    });
    
    // Product card click (open modal)
    document.addEventListener('click', function(e) {
        const productCard = e.target.closest('.product-card');
        if (productCard && !e.target.closest('.add-to-cart-btn')) {
            const productId = parseInt(productCard.dataset.id);
            openProductModal(productId);
        }
    });
    
    // Close modal
    closeModal.addEventListener('click', closeProductModal);
    modalOverlay.addEventListener('click', closeProductModal);
    
    // Category cards
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            filterProductsByCategory(category);
        });
    });
    
    // Cart item quantity buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quantity-btn') || e.target.closest('.quantity-btn')) {
            const btn = e.target.classList.contains('quantity-btn') ? e.target : e.target.closest('.quantity-btn');
            const productId = parseInt(btn.dataset.id);
            const action = btn.dataset.action;
            
            updateCartItemQuantity(productId, action);
        }
    });
    
    // Remove item from cart
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            const btn = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
            const productId = parseInt(btn.dataset.id);
            removeFromCart(productId);
        }
    });
    
    // Scroll event for header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
    
    if (cartSidebar.classList.contains('active')) {
        renderCartItems();
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    
    // Toggle hamburger animation
    const bars = hamburgerMenu.querySelectorAll('.bar');
    if (mobileMenu.classList.contains('active')) {
        bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showAddToCartAnimation(productId);
}

// Show animation when adding to cart
function showAddToCartAnimation(productId) {
    const btn = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
    
    if (!btn) return;
    
    btn.innerHTML = '<i class="fas fa-check"></i> Added';
    btn.style.backgroundColor = '#10b981';
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-shopping-bag"></i> Add to Cart';
        btn.style.backgroundColor = '';
    }, 1500);
}

// Update cart item quantity
function updateCartItemQuantity(productId, action) {
    const cartItem = cart.find(item => item.id === productId);
    
    if (!cartItem) return;
    
    if (action === 'increase') {
        cartItem.quantity += 1;
    } else if (action === 'decrease') {
        cartItem.quantity -= 1;
        
        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
    }
    
    saveCart();
    renderCartItems();
    updateCartCount();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
    updateCartCount();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Render cart items
function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any products to your cart yet.</p>
            </div>
        `;
        cartSubtotalElement.textContent = '$0.00';
        cartTotalElement.textContent = '$0.00';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => {
        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    
    // Calculate total (subtotal + tax)
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = count;
    
    if (count > 0) {
        cartCountElement.style.display = 'flex';
    } else {
        cartCountElement.style.display = 'none';
    }
}

// Open product modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    modalBody.innerHTML = `
        <div class="modal-product">
            <div class="modal-product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="modal-product-details">
                <h2>${product.name}</h2>
                
                <div class="modal-product-meta">
                    <div class="modal-product-rating">
                        <i class="fas fa-star"></i>
                        <span>${product.rating}</span>
                    </div>
                    <div class="modal-product-category">${product.category}</div>
                </div>
                
                <div class="modal-product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                
                <div class="modal-product-description">
                    ${product.description}
                </div>
                
                <div class="modal-product-features">
                    <div class="feature">
                        <i class="fas fa-truck"></i>
                        <span>Free shipping on orders over $50</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-shield-alt"></i>
                        <span>2-year warranty included</span>
                    </div>
                </div>
                
                <div class="modal-product-actions">
                    <div class="quantity-selector">
                        <label for="modal-quantity">Qty:</label>
                        <select id="modal-quantity">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    
                    <button class="add-to-cart-btn modal-add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-bag"></i>
                        Add to Cart
                    </button>
                </div>
                
                <div class="modal-action-btns">
                    <button class="modal-action-btn">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="modal-action-btn">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    productModal.classList.add('active');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close product modal
function closeProductModal() {
    productModal.classList.remove('active');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Filter products by category
function filterProductsByCategory(category) {
    const categoryProducts = products.filter(product => product.category.toLowerCase() === category);
    
    // This is just a simple implementation - in a real app, you'd navigate to a category page
    // For this demo, we'll just update the featured products section with the filtered results
    featuredProductsContainer.innerHTML = categoryProducts.map(product => createProductCard(product)).join('');
    
    // Update section title
    document.querySelector('.featured-products .section-title').textContent = 
        category.charAt(0).toUpperCase() + category.slice(1) + ' Products';
    
    // Scroll to the featured products section
    document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', init);
