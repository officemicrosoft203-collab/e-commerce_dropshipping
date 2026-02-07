// Sistema de Navegação do Admin
class AdminNavigation {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }
    
    init() {
        this.setupNavLinks();
        this.loadDashboard();
    }
    
    setupNavLinks() {
        const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Se é um link externo, deixa passar
                if (link.getAttribute('target') === '_blank') return;
                
                // Se é logout, deixa passar
                if (link.textContent.includes('Sair')) return;
                
                e.preventDefault();
                
                const text = link.textContent.toLowerCase().trim();
                
                if (text.includes('dashboard')) {
                    this.loadDashboard();
                } else if (text.includes('produtos')) {
                    this.loadProducts();
                } else if (text.includes('pedidos')) {
                    this.loadOrders();
                } else if (text.includes('clientes')) {
                    this.loadCustomers();
                } else if (text.includes('analytics')) {
                    this.loadAnalytics();
                } else if (text.includes('relatórios')) {
                    this.loadReports();
                }
                
                // Atualizar nav ativa
                this.updateActiveNav(text);
            });
        });
    }
    
    updateActiveNav(text) {
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            if (link.textContent.toLowerCase().includes(text.split(' ')[0])) {
                link.classList.add('active');
            }
        });
    }
    
    loadDashboard() {
        this.currentSection = 'dashboard';
        if (window.adminDashboard) {
            window.adminDashboard.render();
        }
    }
    
    loadProducts() {
        this.currentSection = 'products';
        if (window.adminProducts) {
            window.adminProducts.render();
        }
    }
    
    loadOrders() {
        this.currentSection = 'orders';
        if (window.adminOrders) {
            window.adminOrders.render();
        }
    }
    
    loadCustomers() {
        this.currentSection = 'customers';
        if (window.adminCustomers) {
            window.adminCustomers.render();
        }
    }
    
    loadAnalytics() {
        this.currentSection = 'analytics';
        showNotification('Seção de Analytics em desenvolvimento', 'info');
    }
    
    loadReports() {
        this.currentSection = 'reports';
        showNotification('Seção de Relatórios em desenvolvimento', 'info');
    }
}

// Inicializar
const adminNav = new AdminNavigation();
window.adminNav = adminNav;