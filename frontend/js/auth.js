// Sistema de Autenticação Global
class AuthSystem {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.init();
    }
    
    init() {
        this.updateNavbar();
        this.protectPages();
    }
    
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser')) || null;
    }
    
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    updateNavbar() {
        const userMenu = document.querySelector('.user-menu');
        if (!userMenu) return;
        
        if (this.isLoggedIn()) {
            const firstName = this.currentUser.name.split(' ')[0];
            userMenu.innerHTML = `
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                        <i class="bi bi-person-circle me-1"></i> ${firstName}
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="profile.html"><i class="bi bi-person me-2"></i>Meu Perfil</a></li>
                        <li><a class="dropdown-item" href="orders.html"><i class="bi bi-receipt me-2"></i>Meus Pedidos</a></li>
                        <li><a class="dropdown-item" href="favorites.html"><i class="bi bi-heart me-2"></i>Favoritos</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="auth.logout()"><i class="bi bi-box-arrow-right me-2"></i>Sair</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link position-relative" href="cart.html">
                        <i class="bi bi-cart3 fs-5"></i>
                        <span class="cart-badge" id="cartCount">0</span>
                    </a>
                </li>
            `;
        } else {
            userMenu.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="login.html">
                        <i class="bi bi-box-arrow-in-right me-1"></i>Entrar
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link position-relative" href="cart.html">
                        <i class="bi bi-cart3 fs-5"></i>
                        <span class="cart-badge" id="cartCount">0</span>
                    </a>
                </li>
            `;
        }
        
        // Atualizar contador do carrinho
        this.updateCartCount();
    }
    
    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        document.querySelectorAll('.cart-badge').forEach(badge => {
            badge.textContent = totalItems;
        });
    }
    
    protectPages() {
        // Páginas que exigem login
        const protectedPages = ['profile.html', 'favorites.html', 'orders.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage) && !this.isLoggedIn()) {
            window.location.href = 'login.html';
        }
    }
    
    logout() {
        localStorage.removeItem('currentUser');
        this.showNotification('Logout realizado com sucesso!', 'info');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
    
    showNotification(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alert.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi ${type === 'success' ? 'bi-check-circle' : type === 'danger' ? 'bi-exclamation-circle' : 'bi-info-circle'} me-2 fs-5"></i>
                <div>${message}</div>
                <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 3000);
    }
}

// Inicializar sistema de autenticação
const auth = new AuthSystem();
window.auth = auth;

// Atualizar carrinho quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    auth.updateCartCount();
});