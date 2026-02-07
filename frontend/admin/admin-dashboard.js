// admin-dashboard.js - Funcionalidades do Dashboard

// Estado global da aplicação
const AppState = {
    currentSection: 'dashboard',
    products: [],
    orders: [],
    customers: [],
    reports: []
};

// Inicialização do dashboard
function initDashboard() {
    console.log('Dashboard inicializado');
    
    // Carregar dados iniciais
    loadDashboardData();
    
    // Inicializar gráficos
    initCharts();
    
    // Configurar eventos
    setupEventListeners();
    
    // Atualizar contadores na sidebar
    updateSidebarCounters();
}

// Carregar dados do dashboard
function loadDashboardData() {
    // Simular carregamento de dados
    setTimeout(() => {
        // Atualizar estatísticas
        document.getElementById('total-revenue').textContent = 'R$ 25.847,90';
        document.getElementById('total-orders').textContent = '42';
        document.getElementById('total-products').textContent = '156';
        document.getElementById('total-customers').textContent = '892';
        
        // Atualizar contadores na sidebar
        document.getElementById('product-count').textContent = '156';
        document.getElementById('order-count').textContent = '42';
        document.getElementById('customer-count').textContent = '892';
        
        // Carregar pedidos recentes
        loadRecentOrders();
        
        // Carregar produtos mais vendidos
        loadTopProducts();
    }, 1000);
}

// Inicializar gráficos
function initCharts() {
    // Gráfico de vendas
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['1', '5', '10', '15', '20', '25', '30'],
            datasets: [{
                label: 'Vendas (R$)',
                data: [1200, 1900, 1500, 2800, 2200, 3000, 2500],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
    
    // Gráfico de categorias
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    const categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: ['Eletrônicos', 'Informática', 'Games', 'Escritório', 'Outros'],
            datasets: [{
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    '#4361ee',
                    '#7209b7',
                    '#4cc9f0',
                    '#f72585',
                    '#4895ef'
                ],
                borderWidth: 1,
                borderColor: '#1e293b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        padding: 20
                    }
                }
            }
        }
    });
}

// Carregar pedidos recentes
function loadRecentOrders() {
    const orders = [
        { id: '#1025', customer: 'Maria Silva', amount: 'R$ 249,90', status: 'Entregue' },
        { id: '#1024', customer: 'João Santos', amount: 'R$ 189,90', status: 'Em transporte' },
        { id: '#1023', customer: 'Ana Pereira', amount: 'R$ 399,90', status: 'Processando' },
        { id: '#1022', customer: 'Carlos Oliveira', amount: 'R$ 159,90', status: 'Entregue' },
        { id: '#1021', customer: 'Fernanda Costa', amount: 'R$ 299,90', status: 'Cancelado' }
    ];
    
    const tbody = document.getElementById('recent-orders');
    tbody.innerHTML = '';
    
    orders.forEach(order => {
        let statusClass = '';
        switch(order.status) {
            case 'Entregue': statusClass = 'bg-success'; break;
            case 'Em transporte': statusClass = 'bg-info'; break;
            case 'Processando': statusClass = 'bg-warning'; break;
            case 'Cancelado': statusClass = 'bg-danger'; break;
        }
        
        const row = `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${order.customer}</td>
                <td>${order.amount}</td>
                <td><span class="badge ${statusClass} badge-status">${order.status}</span></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Carregar produtos mais vendidos
function loadTopProducts() {
    const products = [
        { name: 'Mouse Gamer RGB', sales: 142, stock: 15, status: 'Em estoque' },
        { name: 'Teclado Mecânico', sales: 98, stock: 8, status: 'Estoque baixo' },
        { name: 'Monitor 24"', sales: 76, stock: 22, status: 'Em estoque' },
        { name: 'Headphone Bluetooth', sales: 65, stock: 0, status: 'Esgotado' },
        { name: 'Webcam 4K', sales: 54, stock: 12, status: 'Em estoque' }
    ];
    
    const tbody = document.getElementById('top-products');
    tbody.innerHTML = '';
    
    products.forEach(product => {
        let stockClass = '';
        let statusClass = '';
        
        if (product.stock === 0) {
            stockClass = 'text-danger';
            statusClass = 'bg-danger';
        } else if (product.stock < 10) {
            stockClass = 'text-warning';
            statusClass = 'bg-warning';
        } else {
            stockClass = 'text-success';
            statusClass = 'bg-success';
        }
        
        const row = `
            <tr>
                <td>${product.name}</td>
                <td>${product.sales}</td>
                <td class="${stockClass}">${product.stock}</td>
                <td>
                    <span class="badge ${statusClass} badge-status me-2">${product.status}</span>
                    <button class="btn btn-sm btn-outline-primary" onclick="editProduct('${product.name}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Configurar eventos
function setupEventListeners() {
    // Botão de atualizar
    document.querySelector('[onclick="refreshDashboard()"]').addEventListener('click', refreshDashboard);
    
    // Filtro do gráfico
    document.querySelector('[onchange="updateChart(this.value)"]').addEventListener('change', function(e) {
        updateChart(e.target.value);
    });
}

// Atualizar dashboard
function refreshDashboard() {
    const refreshBtn = document.querySelector('[onclick="refreshDashboard()"]');
    refreshBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Atualizando...';
    refreshBtn.disabled = true;
    
    setTimeout(() => {
        loadDashboardData();
        refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Atualizar';
        refreshBtn.disabled = false;
        
        // Mostrar notificação
        showNotification('Dashboard atualizado com sucesso!', 'success');
    }, 1500);
}

// Atualizar gráfico
function updateChart(days) {
    console.log(`Atualizando gráfico para ${days} dias`);
    // Aqui você faria uma requisição para atualizar o gráfico
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Atualizar contadores na sidebar
function updateSidebarCounters() {
    // Simular atualização de contadores
    setInterval(() => {
        const productCount = document.getElementById('product-count');
        const orderCount = document.getElementById('order-count');
        const customerCount = document.getElementById('customer-count');
        
        // Simular pequenas alterações
        const newOrders = Math.floor(Math.random() * 3);
        if (newOrders > 0) {
            orderCount.textContent = parseInt(orderCount.textContent) + newOrders;
            showNotification(`${newOrders} novo(s) pedido(s) recebido(s)!`, 'success');
        }
    }, 30000); // A cada 30 segundos
}

// Função para editar produto
function editProduct(productName) {
    alert(`Editando produto: ${productName}`);
    // Aqui você abriria um modal de edição
}

// Salvar produto (para o modal)
function saveProduct() {
    const form = document.getElementById('productForm');
    const formData = new FormData(form);
    
    console.log('Produto salvo:', Object.fromEntries(formData));
    showNotification('Produto cadastrado com sucesso!', 'success');
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    modal.hide();
    
    // Limpar formulário
    form.reset();
    
    // Atualizar lista de produtos
    loadTopProducts();
}

// ===== FUNÇÕES PARA AS NOVAS SEÇÕES =====

// Carregar seção de produtos
function loadProductsSection() {
    AppState.currentSection = 'products';
    updateActiveNav();
    
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="mb-1">Gestão de Produtos</h2>
                <p class="text-muted mb-0">Gerencie seu catálogo de dropshipping</p>
            </div>
            <div>
                <button class="btn btn-admin btn-admin-primary" data-bs-toggle="modal" data-bs-target="#addProductModal">
                    <i class="bi bi-plus-circle"></i> Adicionar Produto
                </button>
            </div>
        </div>

        <div class="row g-4">
            <div class="col-12">
                <div class="card-dashboard">
                    <div class="card-header-dashboard d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Todos os Produtos</h5>
                        <div class="input-group input-group-sm" style="width: 300px;">
                            <input type="text" class="form-control bg-dark border-secondary text-light" placeholder="Buscar produto...">
                            <button class="btn btn-outline-secondary" type="button">
                                <i class="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-dashboard">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Produto</th>
                                        <th>Categoria</th>
                                        <th>Preço</th>
                                        <th>Estoque</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="products-table">
                                    <!-- Produtos serão carregados aqui -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadProductsTable();
}

// Carregar tabela de produtos
function loadProductsTable() {
    const products = [
        { id: 1, name: 'Mouse Gamer RGB', category: 'Periféricos', price: 'R$ 89,90', stock: 15, status: 'Ativo' },
        { id: 2, name: 'Teclado Mecânico', category: 'Periféricos', price: 'R$ 249,90', stock: 8, status: 'Ativo' },
        { id: 3, name: 'Monitor 24" LED', category: 'Monitores', price: 'R$ 899,90', stock: 22, status: 'Ativo' },
        { id: 4, name: 'Headphone Bluetooth', category: 'Áudio', price: 'R$ 199,90', stock: 0, status: 'Inativo' },
        { id: 5, name: 'Webcam 4K', category: 'Câmeras', price: 'R$ 349,90', stock: 12, status: 'Ativo' }
    ];
    
    const tbody = document.getElementById('products-table');
    tbody.innerHTML = '';
    
    products.forEach(product => {
        let statusClass = product.status === 'Ativo' ? 'bg-success' : 'bg-danger';
        let stockClass = product.stock === 0 ? 'text-danger' : product.stock < 10 ? 'text-warning' : 'text-success';
        
        const row = `
            <tr>
                <td>#${product.id}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="user-avatar me-3" style="width: 32px; height: 32px; font-size: 0.8rem;">
                            ${product.name.charAt(0)}
                        </div>
                        <div>
                            <div class="fw-medium">${product.name}</div>
                            <small class="text-muted">SKU: PROD${product.id}</small>
                        </div>
                    </div>
                </td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td class="${stockClass}">${product.stock}</td>
                <td><span class="badge ${statusClass} badge-status">${product.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="editProduct(${product.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${product.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Carregar seção de pedidos
function loadOrdersSection() {
    AppState.currentSection = 'orders';
    updateActiveNav();
    
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="mb-1">Gestão de Pedidos</h2>
                <p class="text-muted mb-0">Gerencie e acompanhe os pedidos dos clientes</p>
            </div>
            <div>
                <button class="btn btn-admin btn-admin-primary" onclick="exportOrders()">
                    <i class="bi bi-download"></i> Exportar Pedidos
                </button>
            </div>
        </div>

        <div class="row g-4 mb-4">
            <div class="col-xl-3 col-lg-6">
                <div class="stat-card">
                    <div class="stat-icon bg-primary bg-opacity-10 text-primary">
                        <i class="bi bi-clock"></i>
                    </div>
                    <div class="stat-value">12</div>
                    <div class="stat-label">Pendentes</div>
                </div>
            </div>
            <div class="col-xl-3 col-lg-6">
                <div class="stat-card">
                    <div class="stat-icon bg-info bg-opacity-10 text-info">
                        <i class="bi bi-truck"></i>
                    </div>
                    <div class="stat-value">18</div>
                    <div class="stat-label">Em Transporte</div>
                </div>
            </div>
            <div class="col-xl-3 col-lg-6">
                <div class="stat-card">
                    <div class="stat-icon bg-success bg-opacity-10 text-success">
                        <i class="bi bi-check-circle"></i>
                    </div>
                    <div class="stat-value">42</div>
                    <div class="stat-label">Entregues</div>
                </div>
            </div>
            <div class="col-xl-3 col-lg-6">
                <div class="stat-card">
                    <div class="stat-icon bg-danger bg-opacity-10 text-danger">
                        <i class="bi bi-x-circle"></i>
                    </div>
                    <div class="stat-value">3</div>
                    <div class="stat-label">Cancelados</div>
                </div>
            </div>
        </div>

        <div class="row g-4">
            <div class="col-12">
                <div class="card-dashboard">
                    <div class="card-header-dashboard">
                        <ul class="nav nav-tabs card-header-tabs" id="ordersTab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#pending" type="button">
                                    Pendentes (12)
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#processing" type="button">
                                    Processando (8)
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#shipping" type="button">
                                    Em Transporte (18)
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#delivered" type="button">
                                    Entregues (42)
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <div class="tab-content" id="ordersTabContent">
                            <div class="tab-pane fade show active" id="pending">
                                <div class="table-responsive">
                                    <table class="table table-dashboard">
                                        <thead>
                                            <tr>
                                                <th>Pedido</th>
                                                <th>Cliente</th>
                                                <th>Data</th>
                                                <th>Valor</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>#1030</td>
                                                <td>João Silva</td>
                                                <td>Hoje, 14:30</td>
                                                <td>R$ 189,90</td>
                                                <td>
                                                    <button class="btn btn-sm btn-primary" onclick="processOrder(1030)">Processar</button>
                                                    <button class="btn btn-sm btn-outline-danger ms-2">Cancelar</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <!-- Outras abas -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Inicializar tabs do Bootstrap
    const tabTriggerList = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabTriggerList.forEach(tabTriggerEl => {
        new bootstrap.Tab(tabTriggerEl);
    });
}

// Carregar seção de analytics
function loadAnalyticsSection() {
    AppState.currentSection = 'analytics';
    updateActiveNav();
    
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="mb-1">Analytics Avançados</h2>
                <p class="text-muted mb-0">Análises detalhadas do seu negócio</p>
            </div>
            <div>
                <select class="form-select form-select-sm bg-dark border-secondary text-light w-auto d-inline-block">
                    <option>Últimos 30 dias</option>
                    <option>Últimos 7 dias</option>
                    <option>Últimos 90 dias</option>
                    <option>Este ano</option>
                </select>
            </div>
        </div>

        <div class="row g-4">
            <div class="col-xl-8">
                <div class="card-dashboard">
                    <div class="card-header-dashboard">
                        <h5 class="mb-0">Performance de Vendas</h5>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="analyticsChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-4">
                <div class="card-dashboard">
                    <div class="card-header-dashboard">
                        <h5 class="mb-0">Conversão por Canal</h5>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="channelChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-4 mt-4">
            <div class="col-xl-6">
                <div class="card-dashboard">
                    <div class="card-header-dashboard">
                        <h5 class="mb-0">CLV (Customer Lifetime Value)</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-center" style="height: 200px;">
                            <div class="text-center">
                                <div class="stat-value text-success">R$ 1.247</div>
                                <div class="stat-label">Valor Médio por Cliente</div>
                                <small class="text-muted">+15% vs período anterior</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-6">
                <div class="card-dashboard">
                    <div class="card-header-dashboard">
                        <h5 class="mb-0">Churn Rate</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-center" style="height: 200px;">
                            <div class="text-center">
                                <div class="stat-value text-danger">2.4%</div>
                                <div class="stat-label">Taxa de Cancelamento</div>
                                <small class="text-muted">-0.8% vs período anterior</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    initAnalyticsCharts();
}

// Carregar seção de relatórios
function loadReportsSection() {
    AppState.currentSection = 'reports';
    updateActiveNav();
    
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="mb-1">Relatórios</h2>
                <p class="text-muted mb-0">Gerar e visualizar relatórios do seu negócio</p>
            </div>
            <div>
                <button class="btn btn-admin btn-admin-primary" onclick="generateReport('completo')">
                    <i class="bi bi-file-earmark-pdf"></i> Gerar Relatório Completo
                </button>
            </div>
        </div>

        <div class="row g-4">
            <div class="col-xl-4 col-lg-6">
                <div class="stat-card">
                    <div class="d-flex align-items-center mb-3">
                        <div class="stat-icon bg-primary bg-opacity-10 text-primary me-3">
                            <i class="bi bi-file-earmark-text"></i>
                        </div>
                        <div>
                            <h5 class="mb-0">Relatório de Vendas</h5>
                            <small class="text-muted">Análise mensal de vendas</small>
                        </div>
                    </div>
                    <p class="text-muted mb-3">Detalhes completos de vendas, ticket médio e crescimento.</p>
                    <button class="btn btn-sm btn-primary w-100" onclick="generateReport('vendas')">
                        <i class="bi bi-download"></i> Gerar Relatório
                    </button>
                </div>
            </div>
            
            <div class="col-xl-4 col-lg-6">
                <div class="stat-card">
                    <div class="d-flex align-items-center mb-3">
                        <div class="stat-icon bg-success bg-opacity-10 text-success me-3">
                            <i class="bi bi-people"></i>
                        </div>
                        <div>
                            <h5 class="mb-0">Relatório de Clientes</h5>
                            <small class="text-muted">Análise de base de clientes</small>
                        </div>
                    </div>
                    <p class="text-muted mb-3">Clientes VIP, taxa de retenção e segmentação RFM.</p>
                    <button class="btn btn-sm btn-success w-100" onclick="generateReport('clientes')">
                        <i class="bi bi-download"></i> Gerar Relatório
                    </button>
                </div>
            </div>
            
            <div class="col-xl-4 col-lg-6">
                <div class="stat-card">
                    <div class="d-flex align-items-center mb-3">
                        <div class="stat-icon bg-warning bg-opacity-10 text-warning me-3">
                            <i class="bi bi-box-seam"></i>
                        </div>
                        <div>
                            <h5 class="mb-0">Relatório de Estoque</h5>
                            <small class="text-muted">Controle de inventário</small>
                        </div>
                    </div>
                    <p class="text-muted mb-3">Produtos com baixo estoque, movimentação e giro.</p>
                    <button class="btn btn-sm btn-warning w-100" onclick="generateReport('estoque')">
                        <i class="bi bi-download"></i> Gerar Relatório
                    </button>
                </div>
            </div>
        </div>

        <div class="row g-4 mt-4">
            <div class="col-12">
                <div class="card-dashboard">
                    <div class="card-header-dashboard">
                        <h5 class="mb-0">Relatórios Gerados Recentemente</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-dashboard">
                                <thead>
                                    <tr>
                                        <th>Relatório</th>
                                        <th>Data</th>
                                        <th>Tipo</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Vendas_Outubro_2024.pdf</td>
                                        <td>01/11/2024</td>
                                        <td><span class="badge bg-primary">Vendas</span></td>
                                        <td><span class="badge bg-success">Completo</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-primary">
                                                <i class="bi bi-eye"></i> Visualizar
                                            </button>
                                            <button class="btn btn-sm btn-outline-success ms-2">
                                                <i class="bi bi-download"></i> Baixar
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
}

// Atualizar navegação ativa
function updateActiveNav() {
    // Remover classe active de todos
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Adicionar classe active no item atual
    const currentNav = document.querySelector(`[onclick="load${capitalizeFirstLetter(AppState.currentSection)}Section()"]`);
    if (currentNav) {
        currentNav.classList.add('active');
    }
}

// Função auxiliar para capitalizar primeira letra
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Funções auxiliares
function processOrder(orderId) {
    showNotification(`Pedido #${orderId} processado com sucesso!`, 'success');
}

function exportOrders() {
    showNotification('Exportando pedidos...', 'info');
}

function generateReport(type) {
    showNotification(`Gerando relatório de ${type}...`, 'info');
}

function deleteProduct(productId) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        showNotification('Produto excluído com sucesso!', 'success');
    }
}

// Inicializar gráficos da seção analytics
function initAnalyticsCharts() {
    // Gráfico de performance
    const analyticsCtx = document.getElementById('analyticsChart').getContext('2d');
    new Chart(analyticsCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Vendas',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                backgroundColor: '#4361ee'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Exportar funções para uso global
window.loadProductsSection = loadProductsSection;
window.loadOrdersSection = loadOrdersSection;
window.loadAnalyticsSection = loadAnalyticsSection;
window.loadReportsSection = loadReportsSection;