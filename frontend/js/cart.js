// Gerenciamento do carrinho
class CartManager {
    constructor() {
        this.cart = this.loadCart();
    }
    
    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }
    
    addItem(productId, quantity = 1, productDetails = null) {
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            if (!productDetails) {
                console.error('Detalhes do produto necessários');
                return false;
            }
            
            this.cart.push({
                id: productDetails.id,
                name: productDetails.name,
                price: productDetails.price,
                quantity: quantity,
                image: productDetails.image
            });
        }
        
        this.saveCart();
        return true;
    }
    
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }
    
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }
    
    clearCart() {
        this.cart = [];
        this.saveCart();
    }
    
    getCart() {
        return this.cart;
    }
    
    getTotalItems() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    getTotalPrice() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    updateCartCount() {
        const countElement = document.getElementById('cartCount');
        if (countElement) {
            countElement.textContent = this.getTotalItems();
        }
    }
    
    // Para usar no carrinho.html
    renderCart() {
        const container = document.getElementById('cartItems');
        if (!container) return;
        
        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-cart-x display-1 text-muted"></i>
                    <h4 class="mt-3">Seu carrinho está vazio</h4>
                    <p class="text-muted">Adicione produtos para continuar</p>
                    <a href="index.html" class="btn btn-primary mt-3">Continuar Comprando</a>
                </div>
            `;
            return;
        }
        
        let html = '';
        this.cart.forEach(item => {
            html += `
                <div class="cart-item row align-items-center mb-3 pb-3 border-bottom">
                    <div class="col-md-2">
                        <img src="${item.image}" class="img-fluid rounded" 
                             onerror="this.src='https://via.placeholder.com/100x100?text=${encodeURIComponent(item.name)}'">
                    </div>
                    <div class="col-md-4">
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">Código: ${item.id}</small>
                    </div>
                    <div class="col-md-2">
                        <input type="number" class="form-control" value="${item.quantity}" min="1" 
                               onchange="cartManager.updateQuantity(${item.id}, this.value)">
                    </div>
                    <div class="col-md-2">
                        <span class="fw-bold">R$ ${(item.price * item.quantity).toFixed(2)}</span>
                        <div><small>Unit: R$ ${item.price.toFixed(2)}</small></div>
                    </div>
                    <div class="col-md-2 text-end">
                        <button class="btn btn-outline-danger btn-sm" onclick="cartManager.removeItem(${item.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Atualizar resumo
        document.getElementById('cartSubtotal').textContent = this.getTotalPrice().toFixed(2);
        document.getElementById('cartTotal').textContent = (this.getTotalPrice() + 15.90).toFixed(2); // + frete
    }
}

// Inicializar gerenciador do carrinho
const cartManager = new CartManager();

// Funções globais para uso nos botões
function addToCart(productId, quantity = 1) {
    const product = productManager.getProductById(productId);
    if (product) {
        cartManager.addItem(productId, quantity, product);
        showToast(`${product.name} adicionado ao carrinho!`, 'success');
    }
}

function updateCartCount() {
    cartManager.updateCartCount();
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    cartManager.updateCartCount();
    
    // Se estiver na página do carrinho, renderizar
    if (window.location.pathname.includes('cart.html')) {
        cartManager.renderCart();
    }
});