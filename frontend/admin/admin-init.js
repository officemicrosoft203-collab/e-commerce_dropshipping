// ===================================
// 🔒 PROTEÇÃO DE ACESSO ADMIN
// ===================================
(function protectAdminPage() {
    const token = localStorage.getItem('adminToken');

    if (!token) {
        console.warn('⛔ Acesso negado: admin não autenticado');
        window.location.href = 'login.html';
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    const adminMenu = document.getElementById('adminMenu');

    if (token && adminMenu) {
        adminMenu.style.display = 'block';
    }
});

document.addEventListener('click', (e) => {
    if (e.target.id === 'adminLogout') {
        e.preventDefault();

        localStorage.removeItem('adminToken');

        window.location.href = 'login.html';
    }
});

// ===================================
// SISTEMA COMPLETO DE NAVEGAÇÃO ADMIN
// ===================================

// 1. DADOS
const AdminData = {
    products: [
        { id: 1, name: 'Mouse Gamer RGB', price: 89.90, category: 'Periféricos', stock: 15, sales: 142 },
        { id: 2, name: 'Teclado Mecânico', price: 299.90, category: 'Periféricos', stock: 8, sales: 98 },
        { id: 3, name: 'Monitor 24" Full HD', price: 899.90, category: 'Monitores', stock: 22, sales: 76 },
        { id: 4, name: 'Headset Gamer 7.1', price: 249.90, category: 'Áudio', stock: 12, sales: 65 },
        { id: 5, name: 'Cadeira Gamer', price: 1299.90, category: 'Móveis', stock: 5, sales: 42 }
    ],
    
    orders: [
        { id: 'ORD-001', customer: 'João Silva', total: 249.90, status: 'Entregue', date: '2025-02-07' },
        { id: 'ORD-002', customer: 'Maria Santos', total: 399.90, status: 'Em transporte', date: '2025-02-06' },
        { id: 'ORD-003', customer: 'Pedro Costa', total: 189.90, status: 'Processando', date: '2025-02-05' },
        { id: 'ORD-004', customer: 'Ana Silva', total: 1299.90, status: 'Entregue', date: '2025-02-04' },
        { id: 'ORD-005', customer: 'Carlos Santos', total: 599.80, status: 'Entregue', date: '2025-02-03' }
    ],
    
    customers: [
        { id: 1, name: 'João Silva', email: 'joao@email.com', city: 'São Paulo', orders: 5, spent: 2450.50 },
        { id: 2, name: 'Maria Santos', email: 'maria@email.com', city: 'Rio de Janeiro', orders: 3, spent: 1240.30 },
        { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', city: 'Belo Horizonte', orders: 8, spent: 4890.70 }
    ],
    
    // Dados de vendas por dia (últimos 30 dias)
    salesByDay: [
        { date: '2025-01-09', sales: 1200, orders: 3 },
        { date: '2025-01-10', sales: 1900, orders: 5 },
        { date: '2025-01-11', sales: 1500, orders: 4 },
        { date: '2025-01-12', sales: 2800, orders: 7 },
        { date: '2025-01-13', sales: 2200, orders: 6 },
        { date: '2025-01-14', sales: 3000, orders: 8 },
        { date: '2025-01-15', sales: 2500, orders: 6 },
        { date: '2025-01-16', sales: 2100, orders: 5 },
        { date: '2025-01-17', sales: 2900, orders: 7 },
        { date: '2025-01-18', sales: 3200, orders: 9 },
        { date: '2025-01-19', sales: 2800, orders: 7 },
        { date: '2025-01-20', sales: 3100, orders: 8 },
        { date: '2025-01-21', sales: 2600, orders: 6 },
        { date: '2025-01-22', sales: 2400, orders: 5 },
        { date: '2025-01-23', sales: 3400, orders: 9 },
        { date: '2025-01-24', sales: 3100, orders: 8 },
        { date: '2025-01-25', sales: 2900, orders: 7 },
        { date: '2025-01-26', sales: 3300, orders: 8 },
        { date: '2025-01-27', sales: 3500, orders: 9 },
        { date: '2025-01-28', sales: 3200, orders: 8 },
        { date: '2025-01-29', sales: 3000, orders: 7 },
        { date: '2025-01-30', sales: 3400, orders: 9 },
        { date: '2025-01-31', sales: 3600, orders: 10 },
        { date: '2025-02-01', sales: 2800, orders: 7 },
        { date: '2025-02-02', sales: 3200, orders: 8 },
        { date: '2025-02-03', sales: 2900, orders: 7 },
        { date: '2025-02-04', sales: 3500, orders: 9 },
        { date: '2025-02-05', sales: 3100, orders: 8 },
        { date: '2025-02-06', sales: 3300, orders: 8 },
        { date: '2025-02-07', sales: 2600, orders: 6 }
    ],
    
    // Dados por categoria
    categories: [
        { name: 'Periféricos', sales: 240, revenue: 45000 },
        { name: 'Monitores', sales: 76, revenue: 68000 },
        { name: 'Áudio', sales: 65, revenue: 16000 },
        { name: 'Móveis', sales: 42, revenue: 54500 },
        { name: 'Outros', sales: 38, revenue: 12000 }
    ],
    
    getStats() {
        return {
            totalProducts: this.products.length,
            totalRevenue: this.orders.reduce((sum, o) => sum + o.total, 0),
            totalOrders: this.orders.length,
            totalCustomers: this.customers.length,
            ordersToday: this.orders.filter(o => o.date === new Date().toISOString().split('T')[0]).length
        };
    }
};

// 2. RENDERIZADORES
const AdminRender = {
    dashboard() {
        const content = document.getElementById('dashboard-content');
        if (!content) {
            console.error('Elemento #dashboard-content não encontrado');
            return;
        }
        
        const stats = AdminData.getStats();
        const recentOrders = AdminData.orders.slice(0, 3);
        const topProducts = AdminData.products.sort((a, b) => b.sales - a.sales).slice(0, 3);
        
        content.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4" style="padding-top: 80px;">
                <div>
                    <h2 class="mb-1">Dashboard Empresarial</h2>
                    <p class="text-muted-small mb-0">Visão geral do seu negócio de dropshipping</p>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <span class="text-muted-small" id="current-date-display"></span>
                    <button class="btn btn-outline-light btn-sm" onclick="location.reload()">
                        <i class="bi bi-arrow-clockwise"></i> Atualizar
                    </button>
                </div>
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
            <div class="row g-4">
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
                                                    <span class="badge ${AdminRender.getStatusBadge(order.status)}">
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
                                                <td class="${AdminRender.getStockClass(product.stock)}">${product.stock}</td>
                                                <td>
                                                    <span class="badge ${AdminRender.getStockBadge(product.stock)}">
                                                        ${AdminRender.getStockText(product.stock)}
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
        
        // Adicionar data após renderizar
        setTimeout(() => {
            const dateEl = document.getElementById('current-date-display');
            if (dateEl) {
                dateEl.textContent = new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            }
        }, 100);
    },
    
    products() {
        const content = document.getElementById('dashboard-content');
        if (!content) return;
        
        content.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-1">Gestão de Produtos</h2>
                    <p class="text-muted-small mb-0">Gerencie seu catálogo de dropshipping</p>
                </div>
                <button class="btn btn-success btn-sm" onclick="importProductsFromDropi(event)">
                    <i class="bi bi-download"></i> Importar de Dropi
                </button>
            </div>

            <div class="card-dashboard">
                <div class="card-header-dashboard">
                    <h5 class="mb-0">Todos os Produtos (${AdminData.products.length})</h5>
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
                                ${AdminData.products.map(product => `
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
    },
    
    orders() {
        const content = document.getElementById('dashboard-content');
        if (!content) return;
        
        content.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-1">Gestão de Pedidos</h2>
                    <p class="text-muted-small mb-0">Acompanhe e gerencie os pedidos dos clientes</p>
                </div>
            </div>

            <div class="card-dashboard">
                <div class="card-header-dashboard">
                    <h5 class="mb-0">Todos os Pedidos (${AdminData.orders.length})</h5>
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
                                ${AdminData.orders.map(order => `
                                    <tr>
                                        <td><strong>${order.id}</strong></td>
                                        <td>${order.customer}</td>
                                        <td>${new Date(order.date).toLocaleDateString('pt-BR')}</td>
                                        <td>R$ ${order.total.toFixed(2).replace('.', ',')}</td>
                                        <td>
                                            <span class="badge ${AdminRender.getStatusBadge(order.status)}">
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
    },
    
    customers() {
        const content = document.getElementById('dashboard-content');
        if (!content) return;
        
        content.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-1">Gestão de Clientes</h2>
                    <p class="text-muted-small mb-0">Gerencie sua base de clientes</p>
                </div>
            </div>

            <div class="card-dashboard">
                <div class="card-header-dashboard">
                    <h5 class="mb-0">Clientes Cadastrados (${AdminData.customers.length})</h5>
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
                                ${AdminData.customers.map(customer => `
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
    },
    
    analytics() {
        const content = document.getElementById('dashboard-content');
        if (!content) return;
        
        const totalRevenue = AdminData.orders.reduce((sum, o) => sum + o.total, 0);
        const avgOrderValue = totalRevenue / AdminData.orders.length;
        const totalSales = AdminData.products.reduce((sum, p) => sum + p.sales, 0);
        
        content.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-1">Analytics Avançados</h2>
                    <p class="text-muted-small mb-0">Análises detalhadas do seu negócio</p>
                </div>
            </div>

            <!-- Cards de Métricas -->
            <div class="row g-4 mb-4">
                <div class="col-xl-3 col-lg-6">
                    <div class="stat-card">
                        <div class="stat-icon bg-primary bg-opacity-10 text-primary">
                            <i class="bi bi-graph-up"></i>
                        </div>
                        <div class="stat-value">R$ ${totalRevenue.toFixed(2).replace('.', ',')}</div>
                        <div class="stat-label">Receita Total</div>
                        <small class="text-success">+12% vs mês anterior</small>
                    </div>
                </div>
                
                <div class="col-xl-3 col-lg-6">
                    <div class="stat-card">
                        <div class="stat-icon bg-info bg-opacity-10 text-info">
                            <i class="bi bi-basket"></i>
                        </div>
                        <div class="stat-value">${totalSales}</div>
                        <div class="stat-label">Total de Vendas</div>
                        <small class="text-success">+8% vs mês anterior</small>
                    </div>
                </div>
                
                <div class="col-xl-3 col-lg-6">
                    <div class="stat-card">
                        <div class="stat-icon bg-success bg-opacity-10 text-success">
                            <i class="bi bi-percent"></i>
                        </div>
                        <div class="stat-value">R$ ${avgOrderValue.toFixed(2).replace('.', ',')}</div>
                        <div class="stat-label">Ticket Médio</div>
                        <small class="text-success">+5% vs mês anterior</small>
                    </div>
                </div>
                
                <div class="col-xl-3 col-lg-6">
                    <div class="stat-card">
                        <div class="stat-icon bg-warning bg-opacity-10 text-warning">
                            <i class="bi bi-person"></i>
                        </div>
                        <div class="stat-value">${AdminData.customers.length}</div>
                        <div class="stat-label">Clientes Ativos</div>
                        <small class="text-success">+15% vs mês anterior</small>
                    </div>
                </div>
            </div>

            <!-- Gráficos -->
            <div class="row g-4 mb-4">
                <!-- Gráfico de Vendas por Dia -->
                <div class="col-xl-8">
                    <div class="card-dashboard">
                        <div class="card-header-dashboard d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Vendas (Últimos 30 dias)</h5>
                            <select class="form-select form-select-sm w-auto bg-dark border-secondary text-light" onchange="AdminRender.updateChart(this.value)">
                                <option value="30">30 dias</option>
                                <option value="7">7 dias</option>
                                <option value="90">90 dias</option>
                            </select>
                        </div>
                        <div class="card-body">
                            <div style="height: 350px; position: relative;">
                                <canvas id="salesChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Gráfico de Categorias -->
                <div class="col-xl-4">
                    <div class="card-dashboard">
                        <div class="card-header-dashboard">
                            <h5 class="mb-0">Vendas por Categoria</h5>
                        </div>
                        <div class="card-body">
                            <div style="height: 350px; position: relative;">
                                <canvas id="categoryChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabela de Categorias -->
            <div class="row g-4">
                <div class="col-12">
                    <div class="card-dashboard">
                        <div class="card-header-dashboard">
                            <h5 class="mb-0">Performance por Categoria</h5>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-dashboard">
                                    <thead>
                                        <tr>
                                            <th>Categoria</th>
                                            <th>Vendas</th>
                                            <th>Receita</th>
                                            <th>% do Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${AdminData.categories.map(cat => {
                                            const totalRev = AdminData.categories.reduce((sum, c) => sum + c.revenue, 0);
                                            const percent = ((cat.revenue / totalRev) * 100).toFixed(1);
                                            return `
                                                <tr>
                                                    <td><strong>${cat.name}</strong></td>
                                                    <td>${cat.sales}</td>
                                                    <td>R$ ${cat.revenue.toFixed(2).replace('.', ',')}</td>
                                                    <td>
                                                        <div class="progress" style="height: 20px;">
                                                            <div class="progress-bar bg-primary" role="progressbar" style="width: ${percent}%;" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">${percent}%</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Renderizar gráficos
        setTimeout(() => AdminRender.createCharts(), 100);
    },
    
    reports() {
        const content = document.getElementById('dashboard-content');
        if (!content) return;
        
        const totalRevenue = AdminData.orders.reduce((sum, o) => sum + o.total, 0);
        const totalSales = AdminData.products.reduce((sum, p) => sum + p.sales, 0);
        const avgTicket = totalRevenue / AdminData.orders.length;
        
        content.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="mb-1">Relatórios</h2>
                    <p class="text-muted-small mb-0">Gerar e visualizar relatórios do seu negócio</p>
                </div>
            </div>

            <!-- Opções de Relatórios -->
            <div class="row g-4 mb-4">
                <div class="col-xl-4 col-lg-6">
                    <div class="card-dashboard">
                        <div class="card-body">
                            <div class="d-flex align-items-start mb-3">
                                <div class="stat-icon bg-primary bg-opacity-10 text-primary me-3">
                                    <i class="bi bi-file-earmark-text"></i>
                                </div>
                                <div>
                                    <h5 class="mb-1">Relatório de Vendas</h5>
                                    <small class="text-muted">Análise mensal de vendas</small>
                                </div>
                            </div>
                            <p class="text-muted-small mb-3">Detalhes completos de vendas, ticket médio e crescimento.</p>
                            <button class="btn btn-sm btn-primary w-100" onclick="AdminRender.generateSalesReport()">
                                <i class="bi bi-download me-1"></i> Gerar Relatório
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="col-xl-4 col-lg-6">
                    <div class="card-dashboard">
                        <div class="card-body">
                            <div class="d-flex align-items-start mb-3">
                                <div class="stat-icon bg-success bg-opacity-10 text-success me-3">
                                    <i class="bi bi-people"></i>
                                </div>
                                <div>
                                    <h5 class="mb-1">Relatório de Clientes</h5>
                                    <small class="text-muted">Análise da base de clientes</small>
                                </div>
                            </div>
                            <p class="text-muted-small mb-3">Clientes VIP, taxa de retenção e segmentação.</p>
                            <button class="btn btn-sm btn-success w-100" onclick="AdminRender.generateCustomersReport()">
                                <i class="bi bi-download me-1"></i> Gerar Relatório
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="col-xl-4 col-lg-6">
                    <div class="card-dashboard">
                        <div class="card-body">
                            <div class="d-flex align-items-start mb-3">
                                <div class="stat-icon bg-warning bg-opacity-10 text-warning me-3">
                                    <i class="bi bi-box-seam"></i>
                                </div>
                                <div>
                                    <h5 class="mb-1">Relatório de Estoque</h5>
                                    <small class="text-muted">Controle de inventário</small>
                                </div>
                            </div>
                            <p class="text-muted-small mb-3">Produtos com baixo estoque e giro.</p>
                            <button class="btn btn-sm btn-warning w-100" onclick="AdminRender.generateStockReport()">
                                <i class="bi bi-download me-1"></i> Gerar Relatório
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Resumo Executivo -->
            <div class="row g-4 mb-4">
                <div class="col-12">
                    <div class="card-dashboard">
                        <div class="card-header-dashboard">
                            <h5 class="mb-0">Resumo Executivo</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-3 mb-3">
                                    <h6 class="text-muted mb-2">Período</h6>
                                    <p class="mb-0">Fevereiro 2025</p>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <h6 class="text-muted mb-2">Receita Total</h6>
                                    <p class="mb-0 fs-5 fw-bold text-primary">R$ ${totalRevenue.toFixed(2).replace('.', ',')}</p>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <h6 class="text-muted mb-2">Total de Vendas</h6>
                                    <p class="mb-0 fs-5 fw-bold text-success">${totalSales} unidades</p>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <h6 class="text-muted mb-2">Ticket Médio</h6>
                                    <p class="mb-0 fs-5 fw-bold text-info">R$ ${avgTicket.toFixed(2).replace('.', ',')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Relatórios Gerados -->
            <div class="row g-4">
                <div class="col-12">
                    <div class="card-dashboard">
                        <div class="card-header-dashboard">
                            <h5 class="mb-0">Relatórios Gerados Recentemente</h5>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-dashboard">
                                    <thead>
                                        <tr>
                                            <th>Relatório</th>
                                            <th>Data</th>
                                            <th>Tipo</th>
                                            <th>Tamanho</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Vendas_Fevereiro_2025.csv</td>
                                            <td>07/02/2025 - 14:30</td>
                                            <td><span class="badge bg-primary">Vendas</span></td>
                                            <td>245 KB</td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-primary" onclick="alert('Baixando relatório...')">
                                                    <i class="bi bi-download"></i> Baixar
                                                </button>
                                                <button class="btn btn-sm btn-outline-danger" onclick="alert('Relatório removido')">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Clientes_Janeiro_2025.xlsx</td>
                                            <td>05/02/2025 - 10:15</td>
                                            <td><span class="badge bg-success">Clientes</span></td>
                                            <td>156 KB</td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-primary" onclick="alert('Baixando relatório...')">
                                                    <i class="bi bi-download"></i> Baixar
                                                </button>
                                                <button class="btn btn-sm btn-outline-danger" onclick="alert('Relatório removido')">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Estoque_Fevereiro_2025.pdf</td>
                                            <td>01/02/2025 - 09:45</td>
                                            <td><span class="badge bg-warning">Estoque</span></td>
                                            <td>512 KB</td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-primary" onclick="alert('Baixando relatório...')">
                                                    <i class="bi bi-download"></i> Baixar
                                                </button>
                                                <button class="btn btn-sm btn-outline-danger" onclick="alert('Relatório removido')">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    generateSalesReport() {
        const totalRevenue = AdminData.orders.reduce((sum, o) => sum + o.total, 0);
        const totalSales = AdminData.products.reduce((sum, p) => sum + p.sales, 0);
        const avgTicket = totalRevenue / AdminData.orders.length;
        
        let csv = 'Relatório de Vendas\n';
        csv += 'Data de Geração: ' + new Date().toLocaleDateString('pt-BR') + '\n\n';
        csv += 'RESUMO EXECUTIVO\n';
        csv += 'Receita Total,Valor\n';
        csv += `R$ ${totalRevenue.toFixed(2)},${totalRevenue}\n`;
        csv += `Total de Vendas,${totalSales}\n`;
        csv += `Ticket Médio,R$ ${avgTicket.toFixed(2)}\n\n`;
        csv += 'VENDAS POR PRODUTO\n';
        csv += 'Produto,Categoria,Preço,Vendas,Receita\n';
        
        AdminData.products.forEach(p => {
            const revenue = p.price * p.sales;
            csv += `${p.name},${p.category},${p.price},${p.sales},${revenue}\n`;
        });
        
        AdminRender.downloadCSV(csv, 'Vendas_Fevereiro_2025.csv');
        AdminRender.showNotification('📊 Relatório de Vendas gerado com sucesso!', 'success');
    },
    
    generateCustomersReport() {
        let csv = 'Relatório de Clientes\n';
        csv += 'Data de Geração: ' + new Date().toLocaleDateString('pt-BR') + '\n\n';
        csv += 'LISTA DE CLIENTES\n';
        csv += 'Nome,E-mail,Cidade,Pedidos,Total Gasto\n';
        
        AdminData.customers.forEach(c => {
            csv += `${c.name},${c.email},${c.city},${c.orders},R$ ${c.spent.toFixed(2)}\n`;
        });
        
        AdminRender.downloadCSV(csv, 'Clientes_Janeiro_2025.csv');
        AdminRender.showNotification('👥 Relatório de Clientes gerado com sucesso!', 'success');
    },
    
    generateStockReport() {
        let csv = 'Relatório de Estoque\n';
        csv += 'Data de Geração: ' + new Date().toLocaleDateString('pt-BR') + '\n\n';
        csv += 'CONTROLE DE INVENTÁRIO\n';
        csv += 'Produto,Categoria,Preço,Estoque,Vendas,Status\n';
        
        AdminData.products.forEach(p => {
            const status = p.stock === 0 ? 'Esgotado' : p.stock < 10 ? 'Estoque Baixo' : 'Em Estoque';
            csv += `${p.name},${p.category},${p.price},${p.stock},${p.sales},${status}\n`;
        });
        
        AdminRender.downloadCSV(csv, 'Estoque_Fevereiro_2025.csv');
        AdminRender.showNotification('📦 Relatório de Estoque gerado com sucesso!', 'success');
    },
    
    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    },
    
    showNotification(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alert.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-info-circle'} me-2 fs-5"></i>
                <div>${message}</div>
                <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            if (alert.parentNode) alert.remove();
        }, 4000);
    },
    
    createCharts() {
        // Gráfico de Vendas
        const salesCtx = document.getElementById('salesChart');
        if (salesCtx) {
            const last30Days = AdminData.salesByDay.slice(-30);
            const labels = last30Days.map(d => {
                const date = new Date(d.date);
                return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            });
            const data = last30Days.map(d => d.sales);
            
            new Chart(salesCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Vendas (R$)',
                        data: data,
                        borderColor: '#4361ee',
                        backgroundColor: 'rgba(67, 97, 238, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#4361ee',
                        pointRadius: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: '#94a3b8' },
                            grid: { color: 'rgba(255, 255, 255, 0.08)' }
                        },
                        x: {
                            ticks: { color: '#94a3b8' },
                            grid: { color: 'rgba(255, 255, 255, 0.08)' }
                        }
                    }
                }
            });
        }
        
        // Gráfico de Categorias
        const categoryCtx = document.getElementById('categoryChart');
        if (categoryCtx) {
            new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: AdminData.categories.map(c => c.name),
                    datasets: [{
                        data: AdminData.categories.map(c => c.sales),
                        backgroundColor: [
                            '#4361ee',
                            '#7209b7',
                            '#4cc9f0',
                            '#f72585',
                            '#4895ef'
                        ],
                        borderColor: '#1e293b',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#94a3b8' }
                        }
                    }
                }
            });
        }
    },
    
    updateChart(days) {
        AdminRender.analytics();
    },
    
    // Funções auxiliares
    getStatusBadge(status) {
        const badges = {
            'Entregue': 'bg-success',
            'Em transporte': 'bg-info',
            'Processando': 'bg-warning',
            'Cancelado': 'bg-danger'
        };
        return badges[status] || 'bg-secondary';
    },
    
    getStockClass(stock) {
        if (stock === 0) return 'text-danger';
        if (stock < 10) return 'text-warning';
        return 'text-success';
    },
    
    getStockBadge(stock) {
        if (stock === 0) return 'bg-danger';
        if (stock < 10) return 'bg-warning';
        return 'bg-success';
    },
    
    getStockText(stock) {
        if (stock === 0) return 'Esgotado';
        if (stock < 10) return 'Estoque baixo';
        return 'Em estoque';
    }
};

// 3. NAVEGAÇÃO
const AdminNav = {
    setupLinks() {
        const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
        
        navLinks.forEach(link => {
            const onclick = link.getAttribute('onclick');
            
            // Pular links com target="_blank" e logout
            if (link.getAttribute('target') === '_blank' || onclick?.includes('logout')) {
                return;
            }
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const text = link.textContent.trim().toLowerCase();
                
                // Remover active de todos
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Renderizar seção
                if (text.includes('dashboard')) {
                    AdminRender.dashboard();
                } else if (text.includes('produtos')) {
                    AdminRender.products();
                } else if (text.includes('pedidos')) {
                    AdminRender.orders();
                } else if (text.includes('clientes')) {
                    AdminRender.customers();
                } else if (text.includes('analytics')) {
                    AdminRender.analytics();
                } else if (text.includes('relatórios')) {
                    AdminRender.reports();
                }
            });
        });
    }
};

// ==========================================
// 🚀 FUNÇÃO PARA IMPORTAR PRODUTOS DROPI
// ==========================================
async function importProductsFromDropi(event) {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        alert('❌ Você não está autenticado!');
        return;
    }
    
    // Mostrar loading
    const button = event.target.closest('button');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="bi bi-hourglass-split"></i> Importando...';
    button.disabled = true;
    
    try {
        console.log('📥 Iniciando importação de produtos Dropi...');
        
        const response = await fetch('http://localhost:5001/api/products/import-dropi', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(`✅ Importação Concluída!\n\n📊 Resumo:\n- Novos: ${data.imported}\n- Atualizados: ${data.updated}\n- Erros: ${data.errors}\n- Total: ${data.total}`);
            
            // Recarregar a lista de produtos
            setTimeout(() => {
                AdminRender.products();
            }, 1000);
        } else {
            alert(`❌ Erro na Importação:\n\n${data.error}\n\nDetalhes: ${data.details || 'Sem detalhes'}`);
        }
    } catch (error) {
        alert(`❌ Erro ao conectar:\n\n${error.message}`);
        console.error('Erro completo:', error);
    } finally {
        // Restaurar botão
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

// 4. INICIALIZAR
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Admin Init Carregado');
    
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
        AdminNav.setupLinks();
        AdminRender.dashboard(); // Renderizar dashboard inicial
    }, 500);
});