// Renderizador de Seções do Admin

class AdminDashboard {
    render() {
        const content = document.getElementById('dashboard-content');
        const stats = dataLoader.getStats();
        const recentOrders = dataLoader.orders.slice(0, 3);
        const topProducts = dataLoader.products.sort((a, b) => b.sales - a.sales).slice(0, 5);
        
        content.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-1">Dashboard Empresarial</h2>
                    <p class="text-muted-small mb-0">Visão geral do seu negócio de dropshipping</p>
                </div>
                <button class="btn btn-admin btn-admin-primary" onclick="location.reload()">
                    <i class="bi bi-arrow-clockwise"></i> Atualizar
                </button>
            </div>

            <!-- Cards de Estatísticas -->
            <div class="row g-4 mb-4">
                <div class="col-xl-3 col-lg-6">
                    <div class="stat-card">
                        <div class="stat-icon bg-primary bg-opacity-10 text-primary">
                            <i class="bi bi-currency-dollar"></i>
                        </div>
                        <div class="stat-value">R$ ${stats.totalRevenue.toFixed(2).replace('.', ',')}</div>
                        <div class="stat-label">Receita Total</div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-6">
                    <div class="stat-card">
                        <div class="stat-icon bg-success bg-opacity-10 text-success">
                            <i class="bi bi-cart-check"></i>
                        </div>
                        <div class="stat-value">${stats.ordersToday}</div>
                        <div class="stat-label">Pedidos Hoje</div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-6">
                    <div class="stat-card">
                        <div class="stat-icon bg-info bg-opacity-10 text-info">
                            <i class="bi bi-box-seam"></i>
                        </div>
                        <div class="stat-value">${stats.totalProducts}</div>
                        <div class="stat-label">Produtos Ativos</div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-6">
                    <div class="stat-card">
                        <div class="stat-icon bg-warning bg-opacity-10 text-warning">
                            <i class="bi bi-people"></i>
                        </div>
                        <div class="stat-value">${stats.totalCustomers}</div>
                        <div class="stat-label">Clientes Ativos</div>
                    </div>
                </div>
            </div>

            <!-- Pedidos Recentes -->
            <div class="row g-4 mb-4">
                <div class="col-xl-6">
                    <div class="card-dashboard">
                        <div class="card-header-dashboard">
                            <h5 class="mb-0">Pedidos Recentes</h5>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-dashboard">
                                    <thead>
                                        <tr>
                                            <th>Pedido</th>
                                            <th>Cliente</th>
                                            <th>Valor</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${recentOrders.map(order => `
                                            <tr>
                                                <td><strong>${order.id}</strong></td>
                                                <td>${order.customer}</td>
                                                <td>R$ ${order.total.toFixed(2).replace('.', ',')}</td>
                                                <td>
                                                    <span class="badge ${this.getStatusBadge(order.status)}">
                                                        ${order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Produtos Top -->
                <div class="col-xl-6">
                    <div class="card-dashboard">
                        <div class="card-header-dashboard">
                            <h5 class="mb-0">Produtos Mais Vendidos</h5>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-dashboard">
                                    <thead>
                                        <tr>
                                            <th>Produto</th>
                                            <th>Vendas</th>
                                            <th>Estoque</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${topProducts.map(product => `
                                            <tr>
                                                <td>${product.name}</td>
                                                <td>${product.sales}</td>
                                                <td class="${this.getStockClass(product.stock)}">${product.stock}</td>
                                                <td>
                                                    <span class="badge ${this.getStockBadge(product.stock)}">
                                                        ${this.getStockText(product.stock)}
                                                    </span>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getStatusBadge(status) {
        const badges = {
            'Entregue': 'bg-success',
            'Em transporte': 'bg-info',
            'Processando': 'bg-warning',
            'Cancelado': 'bg-danger'
        };
        return badges[status] || 'bg-secondary';
    }
    
    getStockClass(stock) {
        if (stock === 0) return 'text-danger';
        if (stock < 10) return 'text-warning';
        return 'text-success';
    }
    
    getStockBadge(stock) {
        if (stock === 0) return 'bg-danger';
        if (stock < 10) return 'bg-warning';
        return 'bg-success';
    }
    
    getStockText(stock) {
        if (stock === 0) return 'Esgotado';
        if (stock < 10) return 'Baixo estoque';
        return 'Em estoque';
    }
}

class AdminProducts {
    render() {
        const content = document.getElementById('dashboard-content');
        const products = dataLoader.products;
        
        content.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-1">Gestão de Produtos</h2>
                    <p class="text-muted-small mb-0">Gerencie seu catálogo de dropshipping</p>
                </div>
            </div>

            <div class="card-dashboard">
                <div class="card-header-dashboard">
                    <h5 class="mb-0">Todos os Produtos (${products.length})</h5>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-dashboard">
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Categoria</th>
                                    <th>Preço</th>
                                    <th>Estoque</th>
                                    <th>Vendas</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${products.map(product => `
                                    <tr>
                                        <td><strong>${product.name}</strong></td>
                                        <td>${product.category}</td>
                                        <td>R$ ${product.price.toFixed(2).replace('.', ',')}</td>
                                        <td>${product.stock}</td>
                                        <td>${product.sales}</td>
                                        <td>
                                            <span class="badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}">
                                                ${product.stock > 0 ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
}

class AdminOrders {
    render() {
        const content = document.getElementById('dashboard-content');
        const orders = dataLoader.orders;
        
        content.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-1">Gestão de Pedidos</h2>
                    <p class="text-muted-small mb-0">Acompanhe e gerencie os pedidos dos clientes</p>
                </div>
            </div>

            <div class="card-dashboard">
                <div class="card-header-dashboard">
                    <h5 class="mb-0">Todos os Pedidos (${orders.length})</h5>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-dashboard">
                            <thead>
                                <tr>
                                    <th>Pedido</th>
                                    <th>Cliente</th>
                                    <th>Data</th>
                                    <th>Valor</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orders.map(order => `
                                    <tr>
                                        <td><strong>${order.id}</strong></td>
                                        <td>${order.customer}</td>
                                        <td>${new Date(order.date).toLocaleDateString('pt-BR')}</td>
                                        <td>R$ ${order.total.toFixed(2).replace('.', ',')}</td>
                                        <td>
                                            <span class="badge ${this.getStatusBadge(order.status)}">
                                                ${order.status}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
    
    getStatusBadge(status) {
        const badges = {
            'Entregue': 'bg-success',
            'Em transporte': 'bg-info',
            'Processando': 'bg-warning',
            'Cancelado': 'bg-danger'
        };
        return badges[status] || 'bg-secondary';
    }
}

class AdminCustomers {
    render() {
        const content = document.getElementById('dashboard-content');
        const customers = dataLoader.customers;
        
        content.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-1">Gestão de Clientes</h2>
                    <p class="text-muted-small mb-0">Gerencie sua base de clientes</p>
                </div>
            </div>

            <div class="card-dashboard">
                <div class="card-header-dashboard">
                    <h5 class="mb-0">Clientes Cadastrados (${customers.length})</h5>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-dashboard">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Cidade</th>
                                    <th>Pedidos</th>
                                    <th>Total Gasto</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${customers.map(customer => `
                                    <tr>
                                        <td><strong>${customer.name}</strong></td>
                                        <td>${customer.email}</td>
                                        <td>${customer.city}</td>
                                        <td>${customer.orders}</td>
                                        <td>R$ ${customer.spent.toFixed(2).replace('.', ',')}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
}

// Inicializar
const adminDashboard = new AdminDashboard();
const adminProducts = new AdminProducts();
const adminOrders = new AdminOrders();
const adminCustomers = new AdminCustomers();

window.adminDashboard = adminDashboard;
window.adminProducts = adminProducts;
window.adminOrders = adminOrders;
window.adminCustomers = adminCustomers;

// Renderizar dashboard ao carregar
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard.render();
});