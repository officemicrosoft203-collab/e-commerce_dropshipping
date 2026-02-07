// frontend/admin/customers-management.js
'use strict';

const API_URL = 'http://localhost:5001/api';
let allCustomers = [];
let filteredCustomers = [];
let currentPage = 1;
const itemsPerPage = 12;
let currentView = 'grid';
let customerChart = null;

// Dados de exemplo para demonstração
const sampleCustomers = [
    {
        id: 1,
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 98765-4321',
        tier: 'vip',
        segment: 'high',
        totalSpent: 2845.50,
        orders: 8,
        avgOrderValue: 355.69,
        lastOrder: '2025-12-23',
        joinDate: '2025-01-15',
        customerScore: 92,
        status: 'active',
        city: 'São Paulo',
        state: 'SP',
        tags: ['tecnologia', 'premium', 'frequente'],
        notes: 'Cliente fiel, sempre compra produtos premium'
    },
    {
        id: 2,
        name: 'Maria Santos',
        email: 'maria@email.com',
        phone: '(11) 91234-5678',
        tier: 'regular',
        segment: 'medium',
        totalSpent: 845.20,
        orders: 4,
        avgOrderValue: 211.30,
        lastOrder: '2025-12-22',
        joinDate: '2025-03-22',
        customerScore: 78,
        status: 'active',
        city: 'São Paulo',
        state: 'SP',
        tags: ['moda', 'acessórios'],
        notes: 'Prefere pagamento via PIX'
    },
    {
        id: 3,
        name: 'Carlos Oliveira',
        email: 'carlos@email.com',
        phone: '(21) 99876-5432',
        tier: 'vip',
        segment: 'high',
        totalSpent: 5120.80,
        orders: 15,
        avgOrderValue: 341.39,
        lastOrder: '2025-12-21',
        joinDate: '2024-11-10',
        customerScore: 95,
        status: 'active',
        city: 'Rio de Janeiro',
        state: 'RJ',
        tags: ['empresa', 'volume', 'fidelidade'],
        notes: 'Compra em grande volume para empresa'
    },
    {
        id: 4,
        name: 'Ana Costa',
        email: 'ana@email.com',
        phone: '(31) 98765-1234',
        tier: 'regular',
        segment: 'medium',
        totalSpent: 620.90,
        orders: 3,
        avgOrderValue: 206.97,
        lastOrder: '2025-12-20',
        joinDate: '2025-05-18',
        customerScore: 72,
        status: 'active',
        city: 'Belo Horizonte',
        state: 'MG',
        tags: ['eletrônicos'],
        notes: ''
    },
    {
        id: 5,
        name: 'Pedro Alves',
        email: 'pedro@email.com',
        phone: '(41) 97654-3210',
        tier: 'new',
        segment: 'low',
        totalSpent: 1349.90,
        orders: 1,
        avgOrderValue: 1349.90,
        lastOrder: '2025-12-19',
        joinDate: '2025-12-15',
        customerScore: 65,
        status: 'active',
        city: 'Curitiba',
        state: 'PR',
        tags: ['primeira-compra', 'alto-valor'],
        notes: 'Primeira compra de valor alto'
    },
    {
        id: 6,
        name: 'Fernanda Lima',
        email: 'fernanda@email.com',
        phone: '(51) 99887-6655',
        tier: 'regular',
        segment: 'medium',
        totalSpent: 1895.40,
        orders: 6,
        avgOrderValue: 315.90,
        lastOrder: '2025-12-18',
        joinDate: '2025-02-28',
        customerScore: 81,
        status: 'active',
        city: 'Porto Alegre',
        state: 'RS',
        tags: ['avalia', 'engajada'],
        notes: 'Sempre avalia os produtos'
    },
    {
        id: 7,
        name: 'Roberto Souza',
        email: 'roberto@email.com',
        phone: '(61) 91234-8765',
        tier: 'vip',
        segment: 'high',
        totalSpent: 8750.30,
        orders: 22,
        avgOrderValue: 397.74,
        lastOrder: '2025-12-17',
        joinDate: '2024-08-05',
        customerScore: 98,
        status: 'active',
        city: 'Brasília',
        state: 'DF',
        tags: ['melhor-cliente', 'indica', 'vip'],
        notes: 'Nosso melhor cliente, indica para amigos'
    },
    {
        id: 8,
        name: 'Juliana Martins',
        email: 'juliana@email.com',
        phone: '(71) 98765-0000',
        tier: 'regular',
        segment: 'low',
        totalSpent: 284.70,
        orders: 1,
        avgOrderValue: 284.70,
        lastOrder: '2025-12-16',
        joinDate: '2025-11-30',
        customerScore: 58,
        status: 'active',
        city: 'Salvador',
        state: 'BA',
        tags: ['novo'],
        notes: ''
    },
    {
        id: 9,
        name: 'Ricardo Fernandes',
        email: 'ricardo@email.com',
        phone: '(19) 98877-1122',
        tier: 'inactive',
        segment: 'low',
        totalSpent: 450.00,
        orders: 2,
        avgOrderValue: 225.00,
        lastOrder: '2025-09-10',
        joinDate: '2025-04-12',
        customerScore: 42,
        status: 'inactive',
        city: 'Campinas',
        state: 'SP',
        tags: ['inativo', 'recuperação'],
        notes: 'Sem compras há mais de 90 dias'
    },
    {
        id: 10,
        name: 'Amanda Rodrigues',
        email: 'amanda@email.com',
        phone: '(27) 97766-5544',
        tier: 'vip',
        segment: 'high',
        totalSpent: 3240.50,
        orders: 9,
        avgOrderValue: 360.06,
        lastOrder: '2025-12-15',
        joinDate: '2025-01-30',
        customerScore: 89,
        status: 'active',
        city: 'Vitória',
        state: 'ES',
        tags: ['tecnologia', 'gadgets'],
        notes: 'Gosta de produtos de tecnologia'
    },
    {
        id: 11,
        name: 'Lucas Mendes',
        email: 'lucas@email.com',
        phone: '(85) 96655-4433',
        tier: 'new',
        segment: 'medium',
        totalSpent: 750.80,
        orders: 2,
        avgOrderValue: 375.40,
        lastOrder: '2025-12-14',
        joinDate: '2025-12-01',
        customerScore: 68,
        status: 'active',
        city: 'Fortaleza',
        state: 'CE',
        tags: ['novo', 'potencial'],
        notes: 'Cliente recente com bom potencial'
    },
    {
        id: 12,
        name: 'Beatriz Almeida',
        email: 'beatriz@email.com',
        phone: '(31) 95544-3322',
        tier: 'inactive',
        segment: 'low',
        totalSpent: 320.00,
        orders: 1,
        avgOrderValue: 320.00,
        lastOrder: '2025-07-22',
        joinDate: '2025-06-15',
        customerScore: 35,
        status: 'inactive',
        city: 'Belo Horizonte',
        state: 'MG',
        tags: ['inativo', 'perdido'],
        notes: 'Cliente perdido'
    },
    {
        id: 13,
        name: 'Gabriel Santos',
        email: 'gabriel@email.com',
        phone: '(47) 94433-2211',
        tier: 'regular',
        segment: 'medium',
        totalSpent: 1120.50,
        orders: 5,
        avgOrderValue: 224.10,
        lastOrder: '2025-12-10',
        joinDate: '2025-08-20',
        customerScore: 74,
        status: 'active',
        city: 'Florianópolis',
        state: 'SC',
        tags: ['esportes', 'outdoor'],
        notes: 'Compra produtos esportivos'
    },
    {
        id: 14,
        name: 'Isabela Costa',
        email: 'isabela@email.com',
        phone: '(91) 93322-1100',
        tier: 'vip',
        segment: 'high',
        totalSpent: 4100.00,
        orders: 12,
        avgOrderValue: 341.67,
        lastOrder: '2025-12-05',
        joinDate: '2025-02-15',
        customerScore: 91,
        status: 'active',
        city: 'Belém',
        state: 'PA',
        tags: ['moda', 'luxo'],
        notes: 'Cliente de produtos de luxo'
    },
    {
        id: 15,
        name: 'Marcos Oliveira',
        email: 'marcos@email.com',
        phone: '(83) 92211-0099',
        tier: 'new',
        segment: 'low',
        totalSpent: 199.90,
        orders: 1,
        avgOrderValue: 199.90,
        lastOrder: '2025-12-03',
        joinDate: '2025-11-28',
        customerScore: 55,
        status: 'active',
        city: 'João Pessoa',
        state: 'PB',
        tags: ['novo'],
        notes: 'Primeira compra recente'
    }
];

// Carregar clientes
function loadCustomers() {
    showLoading();
    
    // Simular delay de carregamento
    setTimeout(() => {
        allCustomers = [...sampleCustomers];
        updateCustomerStats();
        applyFilters();
        initializeCharts();
        hideLoading();
    }, 800);
}

// Atualizar estatísticas
function updateCustomerStats() {
    const totalCustomers = allCustomers.length;
    
    // Clientes ativos (comprou nos últimos 30 dias)
    const activeCustomers = allCustomers.filter(c => {
        const lastOrderDate = new Date(c.lastOrder);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return lastOrderDate >= thirtyDaysAgo;
    }).length;
    
    // Clientes VIP
    const vipCustomers = allCustomers.filter(c => c.tier === 'vip').length;
    
    // Novos clientes (últimos 30 dias)
    const newCustomers = allCustomers.filter(c => {
        const joinDate = new Date(c.joinDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return joinDate >= thirtyDaysAgo;
    }).length;
    
    // Clientes inativos (sem compra nos últimos 90 dias)
    const inactiveCustomers = allCustomers.filter(c => {
        const lastOrderDate = new Date(c.lastOrder);
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        return lastOrderDate < ninetyDaysAgo;
    }).length;
    
    // Calcular métricas financeiras
    const totalSpent = allCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = totalCustomers > 0 ? totalSpent / totalCustomers : 0;
    
    // Taxa de retorno (clientes com mais de 1 pedido)
    const repeatCustomers = allCustomers.filter(c => c.orders > 1).length;
    const repeatRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers * 100).toFixed(1) : 0;
    
    // Taxa de churn (clientes inativos)
    const churnRate = totalCustomers > 0 ? (inactiveCustomers / totalCustomers * 100).toFixed(1) : 0;
    
    // Atualizar elementos da página
    document.getElementById('totalCustomers').textContent = totalCustomers;
    document.getElementById('activeCustomers').textContent = activeCustomers;
    document.getElementById('vipCustomers').textContent = vipCustomers;
    document.getElementById('avgOrderValue').textContent = 
        `R$ ${avgOrderValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('repeatRate').textContent = `${repeatRate}%`;
    document.getElementById('churnRate').textContent = `${churnRate}%`;
    
    // Atualizar contadores das tabs
    document.getElementById('countAll').textContent = totalCustomers;
    document.getElementById('countVip').textContent = vipCustomers;
    document.getElementById('countRegular').textContent = allCustomers.filter(c => c.tier === 'regular').length;
    document.getElementById('countNew').textContent = allCustomers.filter(c => c.tier === 'new').length;
    document.getElementById('countInactive').textContent = inactiveCustomers;
}

// Aplicar filtros
function applyFilters() {
    const search = document.getElementById('searchCustomer').value.toLowerCase();
    const tier = document.getElementById('filterTier').value;
    const segment = document.getElementById('filterSegment').value;
    
    filteredCustomers = [...allCustomers];
    
    // Busca por nome, e-mail ou telefone
    if (search) {
        filteredCustomers = filteredCustomers.filter(customer => 
            customer.name.toLowerCase().includes(search) ||
            customer.email.toLowerCase().includes(search) ||
            customer.phone.includes(search)
        );
    }
    
    // Filtrar por nível (tier)
    if (tier) {
        filteredCustomers = filteredCustomers.filter(customer => customer.tier === tier);
    }
    
    // Filtrar por segmento
    if (segment) {
        filteredCustomers = filteredCustomers.filter(customer => customer.segment === segment);
    }
    
    currentPage = 1;
    renderCustomers();
    setupPagination();
}

// Limpar filtros
function clearFilters() {
    document.getElementById('searchCustomer').value = '';
    document.getElementById('filterTier').value = '';
    document.getElementById('filterSegment').value = '';
    
    // Resetar tabs ativas
    document.querySelectorAll('#statusTabs .nav-link').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector('#statusTabs .nav-link:first-child').classList.add('active');
    
    applyFilters();
}

// Renderizar clientes baseado na view atual
function renderCustomers() {
    if (currentView === 'grid') {
        renderCustomersGrid();
    } else if (currentView === 'table') {
        renderCustomersTable();
    } else {
        renderCustomersList();
    }
    
    // Atualizar contador
    document.getElementById('showingCount').textContent = Math.min(filteredCustomers.length, itemsPerPage);
    document.getElementById('totalCount').textContent = filteredCustomers.length;
}

// Renderizar grade de clientes
function renderCustomersGrid() {
    const container = document.getElementById('customersGrid');
    
    if (!filteredCustomers.length) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="text-muted">
                    <i class="bi bi-people fs-1"></i>
                    <h5 class="mt-3">Nenhum cliente encontrado</h5>
                    <p>Não há clientes correspondentes aos filtros aplicados</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Paginação
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageCustomers = filteredCustomers.slice(start, end);
    
    container.innerHTML = pageCustomers.map(customer => `
        <div class="col-xl-3 col-lg-4 col-md-6 mb-4">
            <div class="customer-card">
                <div class="text-center">
                    <div class="customer-avatar">
                        ${customer.name.charAt(0)}
                    </div>
                    <h6 class="mb-1">${customer.name}</h6>
                    <div class="text-muted mb-2">
                        <small><i class="bi bi-envelope"></i> ${customer.email}</small><br>
                        <small><i class="bi bi-telephone"></i> ${customer.phone}</small>
                    </div>
                    <span class="badge-tier ${getTierClass(customer.tier)}">
                        ${getTierText(customer.tier)}
                    </span>
                    <span class="segmentation-badge ${getSegmentClass(customer.segment)} ms-1">
                        ${getSegmentText(customer.segment)}
                    </span>
                </div>
                
                <div class="customer-stats">
                    <div class="stat-item">
                        <div class="stat-value-sm">${customer.orders}</div>
                        <div class="stat-label-sm">Pedidos</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value-sm">R$ ${customer.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</div>
                        <div class="stat-label-sm">Total</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value-sm">
                            ${formatDateShort(customer.lastOrder)}
                        </div>
                        <div class="stat-label-sm">Última</div>
                    </div>
                </div>
                
                <div class="mt-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">Score:</small>
                        <div class="customer-score ${getScoreClass(customer.customerScore)}">
                            ${customer.customerScore}
                        </div>
                    </div>
                    <div class="d-grid gap-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewCustomerDetail(${customer.id})">
                            <i class="bi bi-eye"></i> Ver Detalhes
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="showEmailModal(${customer.id}, '${customer.email}')">
                            <i class="bi bi-envelope"></i> E-mail
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Renderizar tabela de clientes
function renderCustomersTable() {
    const tbody = document.getElementById('customersTableBody');
    
    if (!filteredCustomers.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center py-5">
                    <div class="text-muted">
                        <i class="bi bi-people fs-1"></i>
                        <h5 class="mt-3">Nenhum cliente encontrado</h5>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Paginação
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageCustomers = filteredCustomers.slice(start, end);
    
    tbody.innerHTML = pageCustomers.map((customer, index) => `
        <tr>
            <td>${start + index + 1}</td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="customer-avatar-sm me-2">
                        ${customer.name.charAt(0)}
                    </div>
                    <div>
                        <strong>${customer.name}</strong><br>
                        <small class="text-muted">ID: ${customer.id}</small>
                    </div>
                </div>
            </td>
            <td>
                <small>${customer.email}</small><br>
                <small class="text-muted">${customer.phone}</small>
            </td>
            <td>
                <span class="badge-tier ${getTierClass(customer.tier)}">
                    ${getTierText(customer.tier)}
                </span>
            </td>
            <td>
                <span class="segmentation-badge ${getSegmentClass(customer.segment)}">
                    ${getSegmentText(customer.segment)}
                </span>
            </td>
            <td>
                <strong>${customer.orders}</strong><br>
                <small class="text-muted">R$ ${customer.avgOrderValue.toFixed(2)} médio</small>
            </td>
            <td>
                <div class="lifetime-value">
                    R$ ${customer.totalSpent.toFixed(2)}
                </div>
            </td>
            <td>
                ${formatDate(customer.lastOrder)}<br>
                <small class="text-muted">
                    ${getDaysAgo(customer.lastOrder)} dias
                </small>
            </td>
            <td>
                <div class="customer-score ${getScoreClass(customer.customerScore)}">
                    ${customer.customerScore}
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewCustomerDetail(${customer.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" onclick="showEmailModal(${customer.id}, '${customer.email}')">
                        <i class="bi bi-envelope"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" onclick="editCustomer(${customer.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Renderizar lista de clientes
function renderCustomersList() {
    const container = document.getElementById('customersList');
    
    if (!filteredCustomers.length) {
        container.innerHTML = `
            <div class="list-group-item text-center py-5">
                <div class="text-muted">
                    <i class="bi bi-people fs-1"></i>
                    <h5 class="mt-3">Nenhum cliente encontrado</h5>
                </div>
            </div>
        `;
        return;
    }
    
    // Paginação
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageCustomers = filteredCustomers.slice(start, end);
    
    container.innerHTML = pageCustomers.map(customer => `
        <div class="list-group-item bg-dark border-secondary">
            <div class="row align-items-center">
                <div class="col-auto">
                    <div class="customer-avatar-sm">
                        ${customer.name.charAt(0)}
                    </div>
                </div>
                <div class="col">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1">${customer.name}</h6>
                            <small class="text-muted">
                                <i class="bi bi-envelope"></i> ${customer.email} | 
                                <i class="bi bi-telephone"></i> ${customer.phone}
                            </small>
                        </div>
                        <div class="text-end">
                            <div class="d-flex align-items-center gap-2">
                                <span class="badge-tier ${getTierClass(customer.tier)}">
                                    ${getTierText(customer.tier)}
                                </span>
                                <span class="segmentation-badge ${getSegmentClass(customer.segment)}">
                                    ${getSegmentText(customer.segment)}
                                </span>
                                <strong class="text-light">R$ ${customer.totalSpent.toFixed(2)}</strong>
                            </div>
                            <small class="text-muted">
                                ${customer.orders} pedidos • Última: ${formatDateShort(customer.lastOrder)}
                            </small>
                        </div>
                    </div>
                </div>
                <div class="col-auto">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="viewCustomerDetail(${customer.id})">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="showEmailModal(${customer.id}, '${customer.email}')">
                            <i class="bi bi-envelope"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Configurar paginação
function setupPagination() {
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const pagination = document.getElementById('customersPagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Botão anterior
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">
                <i class="bi bi-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Páginas
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    // Botão próximo
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">
                <i class="bi bi-chevron-right"></i>
            </a>
        </li>
    `;
    
    pagination.innerHTML = html;
}

// Inicializar gráficos
function initializeCharts() {
    // Gráfico de distribuição por tier
    const tierData = {
        labels: ['VIP', 'Regular', 'Novos', 'Inativos'],
        datasets: [{
            data: [
                allCustomers.filter(c => c.tier === 'vip').length,
                allCustomers.filter(c => c.tier === 'regular').length,
                allCustomers.filter(c => c.tier === 'new').length,
                allCustomers.filter(c => c.tier === 'inactive').length
            ],
            backgroundColor: [
                'rgba(245, 158, 11, 0.7)',
                'rgba(59, 130, 246, 0.7)',
                'rgba(16, 185, 129, 0.7)',
                'rgba(107, 114, 128, 0.7)'
            ],
            borderColor: [
                'rgba(245, 158, 11, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(107, 114, 128, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    // Se já existir um gráfico, destruir antes de criar novo
    if (customerChart) {
        customerChart.destroy();
    }
    
    // Criar novo gráfico (será usado para diferentes visualizações)
    const ctx = document.getElementById('rfmChart').getContext('2d');
    customerChart = new Chart(ctx, {
        type: 'bar',
        data: tierData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Distribuição por Nível',
                    color: '#e2e8f0'
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    titleColor: '#e2e8f0',
                    bodyColor: '#cbd5e1'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(100, 116, 139, 0.2)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { color: 'rgba(100, 116, 139, 0.2)' },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

// Atualizar gráfico RFM
function updateRFMChart(dimension) {
    if (!customerChart) return;
    
    let labels, data, title;
    
    switch(dimension) {
        case 'recency':
            labels = ['< 7 dias', '8-30 dias', '31-90 dias', '> 90 dias'];
            data = [
                allCustomers.filter(c => getDaysAgo(c.lastOrder) <= 7).length,
                allCustomers.filter(c => getDaysAgo(c.lastOrder) > 7 && getDaysAgo(c.lastOrder) <= 30).length,
                allCustomers.filter(c => getDaysAgo(c.lastOrder) > 30 && getDaysAgo(c.lastOrder) <= 90).length,
                allCustomers.filter(c => getDaysAgo(c.lastOrder) > 90).length
            ];
            title = 'Distribuição por Recência';
            break;
            
        case 'frequency':
            labels = ['1 pedido', '2-3 pedidos', '4-6 pedidos', '7+ pedidos'];
            data = [
                allCustomers.filter(c => c.orders === 1).length,
                allCustomers.filter(c => c.orders >= 2 && c.orders <= 3).length,
                allCustomers.filter(c => c.orders >= 4 && c.orders <= 6).length,
                allCustomers.filter(c => c.orders >= 7).length
            ];
            title = 'Distribuição por Frequência';
            break;
            
        case 'monetary':
            labels = ['Até R$ 500', 'R$ 501-1000', 'R$ 1001-2000', 'R$ 2000+'];
            data = [
                allCustomers.filter(c => c.totalSpent <= 500).length,
                allCustomers.filter(c => c.totalSpent > 500 && c.totalSpent <= 1000).length,
                allCustomers.filter(c => c.totalSpent > 1000 && c.totalSpent <= 2000).length,
                allCustomers.filter(c => c.totalSpent > 2000).length
            ];
            title = 'Distribuição por Valor Monetário';
            break;
            
        default:
            return;
    }
    
    customerChart.data.labels = labels;
    customerChart.data.datasets[0].data = data;
    customerChart.options.plugins.title.text = title;
    customerChart.update();
}

// Funções auxiliares
function getTierClass(tier) {
    return `tier-${tier}`;
}

function getTierText(tier) {
    const tiers = {
        'vip': 'VIP',
        'regular': 'Regular',
        'new': 'Novo',
        'inactive': 'Inativo'
    };
    return tiers[tier] || tier;
}

function getSegmentClass(segment) {
    return `segment-${segment}`;
}

function getSegmentText(segment) {
    const segments = {
        'high': 'Alto Valor',
        'medium': 'Valor Médio',
        'low': 'Baixo Valor'
    };
    return segments[segment] || segment;
}

function getScoreClass(score) {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatDateShort(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
    });
}

function getDaysAgo(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function changePage(page) {
    currentPage = page;
    renderCustomers();
    setupPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Ver detalhes do cliente
function viewCustomerDetail(customerId) {
    const customer = allCustomers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Calcular métricas
    const daysSinceLastOrder = getDaysAgo(customer.lastOrder);
    const customerStatus = daysSinceLastOrder > 90 ? 'Inativo' : 
                          daysSinceLastOrder > 30 ? 'Precisa atenção' : 'Ativo';
    
    // Calcular RFM
    const rfm = calculateRFMSegmentation(customer);
    
    document.getElementById('customerDetailContent').innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <div class="text-center mb-4">
                    <div class="customer-avatar mx-auto" style="width: 80px; height: 80px; font-size: 2rem;">
                        ${customer.name.charAt(0)}
                    </div>
                    <h4 class="mt-3">${customer.name}</h4>
                    <span class="badge-tier ${getTierClass(customer.tier)}">
                        ${getTierText(customer.tier)}
                    </span>
                    <span class="segmentation-badge ${getSegmentClass(customer.segment)} ms-1">
                        ${getSegmentText(customer.segment)}
                    </span>
                </div>
                
                <div class="card bg-dark border-secondary mb-3">
                    <div class="card-body">
                        <h6 class="mb-3">Informações de Contato</h6>
                        <p>
                            <i class="bi bi-envelope me-2"></i>
                            ${customer.email}
                        </p>
                        <p>
                            <i class="bi bi-telephone me-2"></i>
                            ${customer.phone}
                        </p>
                        <p>
                            <i class="bi bi-geo-alt me-2"></i>
                            ${customer.city} - ${customer.state}
                        </p>
                        <p>
                            <i class="bi bi-calendar me-2"></i>
                            Cliente desde ${formatDate(customer.joinDate)}
                        </p>
                        <p>
                            <i class="bi bi-activity me-2"></i>
                            Status: <strong>${customerStatus}</strong>
                        </p>
                    </div>
                </div>
                
                <div class="card bg-dark border-secondary">
                    <div class="card-body">
                        <h6 class="mb-3">Análise RFM</h6>
                        <div class="row text-center">
                            <div class="col-4 mb-3">
                                <div class="display-6">${rfm.rScore}</div>
                                <small class="text-muted">Recência</small>
                            </div>
                            <div class="col-4 mb-3">
                                <div class="display-6">${rfm.fScore}</div>
                                <small class="text-muted">Frequência</small>
                            </div>
                            <div class="col-4 mb-3">
                                <div class="display-6">${rfm.mScore}</div>
                                <small class="text-muted">Valor</small>
                            </div>
                        </div>
                        <div class="text-center">
                            <small class="text-muted">Código RFM: ${rfm.rfmCode}</small>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-8">
                <div class="card bg-dark border-secondary mb-3">
                    <div class="card-header border-secondary d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">Resumo Financeiro</h6>
                        <span class="lifetime-value">Lifetime Value: R$ ${customer.totalSpent.toFixed(2)}</span>
                    </div>
                    <div class="card-body">
                        <div class="row text-center">
                            <div class="col-md-3 mb-3">
                                <div class="stat-value">${customer.orders}</div>
                                <div class="stat-label">Total de Pedidos</div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <div class="stat-value">R$ ${customer.totalSpent.toFixed(2)}</div>
                                <div class="stat-label">Valor Total Gasto</div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <div class="stat-value">R$ ${customer.avgOrderValue.toFixed(2)}</div>
                                <div class="stat-label">Ticket Médio</div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <div class="stat-value">${customer.customerScore}</div>
                                <div class="stat-label">Customer Score</div>
                            </div>
                        </div>
                        
                        <div class="mt-3">
                            <small class="text-muted">
                                Última compra: ${formatDate(customer.lastOrder)} (há ${daysSinceLastOrder} dias)
                            </small>
                        </div>
                    </div>
                </div>
                
                <div class="card bg-dark border-secondary mb-3">
                    <div class="card-header border-secondary">
                        <h6 class="mb-0">Histórico de Compras</h6>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-customers mb-0">
                                <thead>
                                    <tr>
                                        <th>Pedido</th>
                                        <th>Data</th>
                                        <th>Itens</th>
                                        <th>Valor</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Histórico de pedidos simulados -->
                                    ${generateOrderHistory(customer).map(order => `
                                        <tr>
                                            <td>${order.id}</td>
                                            <td>${order.date}</td>
                                            <td>${order.items}</td>
                                            <td>R$ ${order.value}</td>
                                            <td><span class="badge bg-${order.status === 'Entregue' ? 'success' : 'info'}">${order.status}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div class="card bg-dark border-secondary">
                    <div class="card-header border-secondary">
                        <h6 class="mb-0">Tags e Observações</h6>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <div class="d-flex flex-wrap gap-2 mb-3">
                                ${customer.tags.map(tag => `
                                    <span class="badge bg-secondary">${tag}</span>
                                `).join('')}
                            </div>
                            <label class="form-label">Anotações</label>
                            <textarea class="form-control bg-dark border-secondary text-light" rows="3">${customer.notes || ''}</textarea>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary" onclick="showEmailModal(${customer.id}, '${customer.email}')">
                                <i class="bi bi-envelope"></i> Enviar E-mail
                            </button>
                            <button class="btn btn-outline-light" onclick="updateCustomerTier(${customer.id})">
                                <i class="bi bi-star"></i> Alterar Nível
                            </button>
                            ${customer.tier !== 'vip' ? `
                                <button class="btn btn-outline-warning" onclick="makeCustomerVIP(${customer.id})">
                                    <i class="bi bi-gem"></i> Tornar VIP
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('customerDetailModal'));
    modal.show();
}

// Calcular segmentação RFM
function calculateRFMSegmentation(customer) {
    const today = new Date();
    const lastOrderDate = new Date(customer.lastOrder);
    
    // Recência: dias desde última compra
    const recencyDays = Math.floor((today - lastOrderDate) / (1000 * 60 * 60 * 24));
    
    // Frequência: número total de pedidos
    const frequency = customer.orders;
    
    // Valor monetário: valor total gasto
    const monetary = customer.totalSpent;
    
    // Pontuação RFM (escala 1-5)
    let rScore, fScore, mScore;
    
    // Pontuação de Recência
    if (recencyDays <= 7) rScore = 5;
    else if (recencyDays <= 30) rScore = 4;
    else if (recencyDays <= 90) rScore = 3;
    else if (recencyDays <= 180) rScore = 2;
    else rScore = 1;
    
    // Pontuação de Frequência
    if (frequency >= 10) fScore = 5;
    else if (frequency >= 5) fScore = 4;
    else if (frequency >= 3) fScore = 3;
    else if (frequency >= 2) fScore = 2;
    else fScore = 1;
    
    // Pontuação de Valor Monetário
    if (monetary >= 5000) mScore = 5;
    else if (monetary >= 2000) mScore = 4;
    else if (monetary >= 1000) mScore = 3;
    else if (monetary >= 500) mScore = 2;
    else mScore = 1;
    
    return {
        recency: recencyDays,
        frequency: frequency,
        monetary: monetary,
        rScore: rScore,
        fScore: fScore,
        mScore: mScore,
        totalScore: rScore + fScore + mScore,
        rfmCode: `${rScore}${fScore}${mScore}`
    };
}

// Gerar histórico de pedidos simulado
function generateOrderHistory(customer) {
    const orders = [];
    const today = new Date();
    
    // Gerar pedidos baseado no número real de pedidos do cliente
    for (let i = 0; i < Math.min(customer.orders, 5); i++) {
        const orderDate = new Date(today);
        orderDate.setDate(orderDate.getDate() - (i * 15)); // Pedidos a cada 15 dias
        
        const orderValue = customer.avgOrderValue * (0.8 + Math.random() * 0.4); // Variação de ±20%
        const status = Math.random() > 0.3 ? 'Entregue' : 'Processando';
        
        orders.push({
            id: `ORD-${2025}-00${120 + i}`,
            date: orderDate.toLocaleDateString('pt-BR'),
            items: `${Math.floor(Math.random() * 3) + 1} item(s)`,
            value: orderValue.toFixed(2),
            status: status
        });
    }
    
    return orders;
}

// Editar cliente
function editCustomer(customerId) {
    const customer = allCustomers.find(c => c.id === customerId);
    if (!customer) return;
    
    const newName = prompt('Nome do cliente:', customer.name);
    if (newName === null) return;
    
    const newEmail = prompt('E-mail do cliente:', customer.email);
    if (newEmail === null) return;
    
    const newPhone = prompt('Telefone do cliente:', customer.phone);
    if (newPhone === null) return;
    
    // Em um sistema real, faria uma requisição PUT para o backend
    customer.name = newName;
    customer.email = newEmail;
    customer.phone = newPhone;
    
    updateCustomerStats();
    applyFilters();
    
    alert('✅ Cliente atualizado com sucesso!');
}

// Atualizar nível do cliente
function updateCustomerTier(customerId) {
    const customer = allCustomers.find(c => c.id === customerId);
    if (!customer) return;
    
    const newTier = prompt(
        `Alterar nível do cliente ${customer.name}\n\n` +
        `Nível atual: ${getTierText(customer.tier)}\n\n` +
        `Opções: vip, regular, new, inactive`,
        customer.tier
    );
    
    if (newTier && ['vip', 'regular', 'new', 'inactive'].includes(newTier)) {
        customer.tier = newTier;
        
        // Atualizar segmentação baseada no novo tier
        if (newTier === 'vip') {
            customer.segment = 'high';
        } else if (newTier === 'inactive') {
            customer.segment = 'low';
        }
        
        updateCustomerStats();
        applyFilters();
        alert(`✅ Nível do cliente atualizado para: ${getTierText(newTier)}`);
    }
}

// Tornar cliente VIP
function makeCustomerVIP(customerId) {
    if (!confirm('Tornar este cliente VIP?\n\nClientes VIP recebem:\n• Ofertas exclusivas\n• Prioridade no suporte\n• Frete grátis\n• Acesso antecipado a novos produtos')) {
        return;
    }
    
    const customer = allCustomers.find(c => c.id === customerId);
    if (customer) {
        customer.tier = 'vip';
        customer.segment = 'high';
        updateCustomerStats();
        applyFilters();
        alert(`🎉 ${customer.name} agora é um cliente VIP!`);
    }
}

// Exportar clientes
function exportCustomers() {
    if (!filteredCustomers.length) {
        alert('Não há clientes para exportar.');
        return;
    }
    
    let csv = 'ID;Nome;E-mail;Telefone;Nível;Segmento;Pedidos;Valor Total;Ticket Médio;Última Compra;Score;Cidade;Estado;Data Cadastro\n';
    
    filteredCustomers.forEach(customer => {
        csv += `"${customer.id}";"${customer.name}";"${customer.email}";"${customer.phone}";"${getTierText(customer.tier)}";"${getSegmentText(customer.segment)}";"${customer.orders}";"${customer.totalSpent}";"${customer.avgOrderValue}";"${customer.lastOrder}";"${customer.customerScore}";"${customer.city}";"${customer.state}";"${customer.joinDate}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clientes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    alert(`📊 ${filteredCustomers.length} clientes exportados com sucesso!`);
}

// Atualizar lista de clientes
function refreshCustomers() {
    showLoading();
    
    // Simular recarregamento dos dados
    setTimeout(() => {
        // Em um sistema real, faria uma requisição para o backend
        loadCustomers();
        alert('🔄 Lista de clientes atualizada!');
    }, 1000);
}

// Mostrar tela de carregamento
function showLoading() {
    const container = document.getElementById('customersGrid');
    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2">Carregando clientes...</p>
        </div>
    `;
}

// Esconder tela de carregamento
function hideLoading() {
    // Já atualizado pelo renderCustomers
}

// Exportar funções globais
window.loadCustomers = loadCustomers;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.filterByTier = filterByTier;
window.setViewMode = setViewMode;
window.changePage = changePage;
window.viewCustomerDetail = viewCustomerDetail;
window.editCustomer = editCustomer;
window.updateCustomerTier = updateCustomerTier;
window.makeCustomerVIP = makeCustomerVIP;
window.exportCustomers = exportCustomers;
window.refreshCustomers = refreshCustomers;
window.updateRFMChart = updateRFMChart;

// Funções do modal de e-mail (definidas no HTML)
window.showEmailModal = showEmailModal;
window.sendCustomerEmail = sendCustomerEmail;
window.showCampaignModal = showCampaignModal;
window.createCampaign = createCampaign;