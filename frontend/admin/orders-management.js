// frontend/admin/orders-management.js
'use strict';

const API_URL = 'http://localhost:5001/api';
let allOrders = [];
let filteredOrders = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentView = 'list';

// Dados de exemplo (simulando backend)
const sampleOrders = [
    {
        id: 'ORD-2025-00125',
        customer: {
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '(11) 98765-4321'
        },
        date: '2025-12-23',
        items: [
            { name: 'Mouse Gamer RGB', price: 89.90, quantity: 1, image: null },
            { name: 'Mousepad XXL', price: 49.90, quantity: 1, image: null }
        ],
        subtotal: 139.80,
        shipping: 15.00,
        total: 154.80,
        status: 'processing',
        payment: 'credit_card',
        shipping_address: {
            street: 'Rua das Flores, 123',
            city: 'São Paulo',
            state: 'SP',
            zip: '01234-567'
        },
        notes: 'Entregar durante o dia'
    },
    {
        id: 'ORD-2025-00124',
        customer: {
            name: 'Maria Santos',
            email: 'maria@email.com',
            phone: '(11) 91234-5678'
        },
        date: '2025-12-22',
        items: [
            { name: 'Teclado Mecânico', price: 199.90, quantity: 1, image: null }
        ],
        subtotal: 199.90,
        shipping: 0.00,
        total: 199.90,
        status: 'pending',
        payment: 'pix',
        shipping_address: {
            street: 'Av. Paulista, 1000',
            city: 'São Paulo',
            state: 'SP',
            zip: '01310-100'
        },
        notes: ''
    },
    {
        id: 'ORD-2025-00123',
        customer: {
            name: 'Carlos Oliveira',
            email: 'carlos@email.com',
            phone: '(21) 99876-5432'
        },
        date: '2025-12-21',
        items: [
            { name: 'Monitor 24" Full HD', price: 899.90, quantity: 1, image: null },
            { name: 'Cabo HDMI', price: 29.90, quantity: 2, image: null }
        ],
        subtotal: 959.70,
        shipping: 25.00,
        total: 984.70,
        status: 'shipped',
        payment: 'credit_card',
        tracking: 'BR123456789',
        shipping_address: {
            street: 'Rua do Comércio, 456',
            city: 'Rio de Janeiro',
            state: 'RJ',
            zip: '20040-008'
        },
        notes: 'Fragil - manusear com cuidado'
    },
    {
        id: 'ORD-2025-00122',
        customer: {
            name: 'Ana Costa',
            email: 'ana@email.com',
            phone: '(31) 98765-1234'
        },
        date: '2025-12-20',
        items: [
            { name: 'Headset Gamer 7.1', price: 249.90, quantity: 1, image: null },
            { name: 'Webcam Full HD', price: 159.90, quantity: 1, image: null }
        ],
        subtotal: 409.80,
        shipping: 12.50,
        total: 422.30,
        status: 'delivered',
        payment: 'boleto',
        shipping_address: {
            street: 'Rua da Paz, 789',
            city: 'Belo Horizonte',
            state: 'MG',
            zip: '30130-150'
        },
        notes: ''
    },
    {
        id: 'ORD-2025-00121',
        customer: {
            name: 'Pedro Alves',
            email: 'pedro@email.com',
            phone: '(41) 97654-3210'
        },
        date: '2025-12-19',
        items: [
            { name: 'Cadeira Gamer Ergonômica', price: 1299.90, quantity: 1, image: null }
        ],
        subtotal: 1299.90,
        shipping: 50.00,
        total: 1349.90,
        status: 'cancelled',
        payment: 'credit_card',
        shipping_address: {
            street: 'Av. Sete de Setembro, 2000',
            city: 'Curitiba',
            state: 'PR',
            zip: '80060-000'
        },
        notes: 'Cliente desistiu da compra'
    },
    {
        id: 'ORD-2025-00120',
        customer: {
            name: 'Fernanda Lima',
            email: 'fernanda@email.com',
            phone: '(51) 99887-6655'
        },
        date: '2025-12-18',
        items: [
            { name: 'SSD 1TB NVMe', price: 399.90, quantity: 2, image: null },
            { name: 'Memória RAM 16GB', price: 299.90, quantity: 2, image: null }
        ],
        subtotal: 1399.60,
        shipping: 20.00,
        total: 1419.60,
        status: 'processing',
        payment: 'pix',
        shipping_address: {
            street: 'Rua dos Andradas, 1500',
            city: 'Porto Alegre',
            state: 'RS',
            zip: '90020-002'
        },
        notes: 'Montar as memórias no SSD antes de enviar'
    },
    {
        id: 'ORD-2025-00119',
        customer: {
            name: 'Roberto Souza',
            email: 'roberto@email.com',
            phone: '(61) 91234-8765'
        },
        date: '2025-12-17',
        items: [
            { name: 'Notebook Gamer', price: 4599.90, quantity: 1, image: null },
            { name: 'Mochila para Notebook', price: 89.90, quantity: 1, image: null }
        ],
        subtotal: 4689.80,
        shipping: 45.00,
        total: 4734.80,
        status: 'shipped',
        payment: 'credit_card',
        tracking: 'BR987654321',
        shipping_address: {
            street: 'SQN 102 Bloco A',
            city: 'Brasília',
            state: 'DF',
            zip: '70732-520'
        },
        notes: 'Presente de natal - enviar com cartão'
    },
    {
        id: 'ORD-2025-00118',
        customer: {
            name: 'Juliana Martins',
            email: 'juliana@email.com',
            phone: '(71) 98765-0000'
        },
        date: '2025-12-16',
        items: [
            { name: 'Mouse Gamer RGB', price: 89.90, quantity: 3, image: null }
        ],
        subtotal: 269.70,
        shipping: 15.00,
        total: 284.70,
        status: 'delivered',
        payment: 'pix',
        shipping_address: {
            street: 'Av. Sete de Setembro, 500',
            city: 'Salvador',
            state: 'BA',
            zip: '40060-001'
        },
        notes: ''
    }
];

// Carregar pedidos
function loadOrders() {
    showLoading();
    
    // Simular delay de carregamento
    setTimeout(() => {
        allOrders = [...sampleOrders];
        updateOrderStats();
        applyFilters();
        hideLoading();
    }, 800);
}

// Atualizar estatísticas
function updateOrderStats() {
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(o => o.status === 'pending').length;
    const todayOrders = allOrders.filter(o => o.date === new Date().toISOString().split('T')[0]).length;
    
    // Calcular receita de hoje
    const today = new Date().toISOString().split('T')[0];
    const todayRevenue = allOrders
        .filter(o => o.date === today)
        .reduce((sum, o) => sum + o.total, 0);
    
    // Calcular média de dias para entrega (simulado)
    const avgDelivery = '7-14';
    
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('todayRevenue').textContent = 
        `R$ ${todayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('avgDelivery').textContent = avgDelivery;
    
    // Atualizar contadores das tabs
    document.getElementById('countAll').textContent = totalOrders;
    document.getElementById('countPending').textContent = allOrders.filter(o => o.status === 'pending').length;
    document.getElementById('countProcessing').textContent = allOrders.filter(o => o.status === 'processing').length;
    document.getElementById('countShipped').textContent = allOrders.filter(o => o.status === 'shipped').length;
    document.getElementById('countDelivered').textContent = allOrders.filter(o => o.status === 'delivered').length;
}

// Aplicar filtros
function applyFilters() {
    const status = document.getElementById('filterStatus').value;
    const period = document.getElementById('filterPeriod').value;
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;
    const search = document.getElementById('searchOrders').value.toLowerCase();
    
    filteredOrders = [...allOrders];
    
    // Filtrar por status
    if (status) {
        filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    // Filtrar por período
    if (period) {
        const today = new Date();
        let startDate;
        
        switch(period) {
            case 'today':
                startDate = new Date(today);
                break;
            case 'week':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);
                break;
            case 'month':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'quarter':
                const quarter = Math.floor(today.getMonth() / 3);
                startDate = new Date(today.getFullYear(), quarter * 3, 1);
                break;
            case 'year':
                startDate = new Date(today.getFullYear(), 0, 1);
                break;
        }
        
        filteredOrders = filteredOrders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= startDate && orderDate <= today;
        });
    }
    
    // Filtrar por data específica
    if (dateFrom && dateTo) {
        filteredOrders = filteredOrders.filter(order => {
            return order.date >= dateFrom && order.date <= dateTo;
        });
    }
    
    // Filtrar por busca
    if (search) {
        filteredOrders = filteredOrders.filter(order => 
            order.id.toLowerCase().includes(search) ||
            order.customer.name.toLowerCase().includes(search) ||
            order.customer.email.toLowerCase().includes(search) ||
            order.items.some(item => item.name.toLowerCase().includes(search))
        );
    }
    
    // Ordenar por data (mais recente primeiro)
    filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    currentPage = 1;
    renderOrders();
    setupPagination();
}

// Limpar filtros
function clearFilters() {
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterPeriod').value = 'month';
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';
    document.getElementById('searchOrders').value = '';
    
    // Resetar tabs ativas
    document.querySelectorAll('#statusTabs .nav-link').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector('#statusTabs .nav-link:first-child').classList.add('active');
    
    applyFilters();
}

// Renderizar pedidos (modo lista)
function renderOrders() {
    if (currentView === 'list') {
        renderOrdersList();
    } else {
        renderOrdersTable();
    }
    
    // Atualizar contador
    document.getElementById('showingCount').textContent = Math.min(filteredOrders.length, itemsPerPage);
    document.getElementById('totalCount').textContent = filteredOrders.length;
}

// Renderizar lista de pedidos
function renderOrdersList() {
    const container = document.getElementById('ordersListContainer');
    
    if (!filteredOrders.length) {
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="text-muted">
                    <i class="bi bi-cart-x fs-1"></i>
                    <h5 class="mt-3">Nenhum pedido encontrado</h5>
                    <p>Não há pedidos correspondentes aos filtros aplicados</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Paginação
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageOrders = filteredOrders.slice(start, end);
    
    container.innerHTML = pageOrders.map(order => `
        <div class="order-card">
            <div class="order-header d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">
                        <i class="bi bi-cart-check me-2"></i>
                        Pedido ${order.id}
                    </h6>
                    <small class="text-muted">${formatDate(order.date)} • ${getPaymentMethod(order.payment)}</small>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <span class="badge-status ${getStatusClass(order.status)}">
                        ${getStatusText(order.status)}
                    </span>
                    <strong class="text-light">R$ ${order.total.toFixed(2)}</strong>
                </div>
            </div>
            
            <div class="order-body">
                <div class="row">
                    <div class="col-md-8">
                        <div class="mb-3">
                            <div class="d-flex align-items-center mb-2">
                                <div class="customer-avatar me-2">
                                    ${order.customer.name.charAt(0)}
                                </div>
                                <div>
                                    <strong>${order.customer.name}</strong><br>
                                    <small class="text-muted">${order.customer.email}</small>
                                </div>
                            </div>
                            <small class="text-muted">
                                <i class="bi bi-geo-alt"></i> 
                                ${order.shipping_address.street}, ${order.shipping_address.city} - ${order.shipping_address.state}
                            </small>
                        </div>
                        
                        <div class="products-list">
                            ${order.items.map(item => `
                                <div class="product-item">
                                    <div class="product-img">
                                        <i class="bi bi-box"></i>
                                    </div>
                                    <div class="flex-grow-1">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <strong>${item.name}</strong><br>
                                                <small class="text-muted">Qtd: ${item.quantity} × R$ ${item.price.toFixed(2)}</small>
                                            </div>
                                            <div class="text-end">
                                                <strong>R$ ${(item.price * item.quantity).toFixed(2)}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="timeline">
                            <div class="timeline-step ${order.status === 'pending' ? 'active' : 'completed'}">
                                <small class="text-muted">Pedido Recebido</small>
                                <div class="text-light">${formatDate(order.date)}</div>
                            </div>
                            
                            <div class="timeline-step ${order.status === 'processing' ? 'active' : 
                                                         ['shipped', 'delivered'].includes(order.status) ? 'completed' : ''}">
                                <small class="text-muted">Processando</small>
                                <div class="text-light">${order.status === 'pending' ? 'Aguardando...' : formatDate(addDays(order.date, 1))}</div>
                            </div>
                            
                            <div class="timeline-step ${order.status === 'shipped' ? 'active' : 
                                                         order.status === 'delivered' ? 'completed' : ''}">
                                <small class="text-muted">Enviado</small>
                                ${order.tracking 
                                    ? `<div class="text-light">Rastreio: ${order.tracking}</div>`
                                    : '<div class="text-light">Aguardando...</div>'
                                }
                            </div>
                            
                            <div class="timeline-step ${order.status === 'delivered' ? 'active' : ''}">
                                <small class="text-muted">Entregue</small>
                                <div class="text-light">
                                    ${order.status === 'delivered' 
                                        ? formatDate(addDays(order.date, 7))
                                        : 'Aguardando...'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                ${order.notes ? `
                    <div class="alert alert-secondary mt-3 mb-0">
                        <small><i class="bi bi-chat-left-text"></i> <strong>Observações:</strong> ${order.notes}</small>
                    </div>
                ` : ''}
            </div>
            
            <div class="order-footer d-flex justify-content-between align-items-center">
                <div>
                    <small class="text-muted">
                        Subtotal: R$ ${order.subtotal.toFixed(2)} • 
                        Frete: R$ ${order.shipping.toFixed(2)} • 
                        Total: <strong>R$ ${order.total.toFixed(2)}</strong>
                    </small>
                </div>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="viewOrderDetail('${order.id}')">
                        <i class="bi bi-eye"></i> Detalhes
                    </button>
                    <button class="btn btn-outline-info" onclick="updateOrderStatus('${order.id}')">
                        <i class="bi bi-pencil"></i> Status
                    </button>
                    <button class="btn btn-outline-success" onclick="printOrder('${order.id}')">
                        <i class="bi bi-printer"></i>
                    </button>
                    ${order.status === 'shipped' ? `
                        <button class="btn btn-outline-warning" onclick="trackOrder('${order.id}')">
                            <i class="bi bi-truck"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Renderizar tabela de pedidos
function renderOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    
    if (!filteredOrders.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5">
                    <div class="text-muted">
                        <i class="bi bi-cart-x fs-1"></i>
                        <h5 class="mt-3">Nenhum pedido encontrado</h5>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Paginação
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageOrders = filteredOrders.slice(start, end);
    
    tbody.innerHTML = pageOrders.map(order => `
        <tr>
            <td>
                <strong>${order.id}</strong><br>
                <small class="text-muted">${formatDate(order.date)}</small>
            </td>
            <td>
                <div>
                    <strong>${order.customer.name}</strong><br>
                    <small class="text-muted">${order.customer.email}</small>
                </div>
            </td>
            <td>
                <small>${order.items.length} item(s)</small><br>
                <small class="text-muted">${order.items[0].name}${order.items.length > 1 ? '...' : ''}</small>
            </td>
            <td>
                <strong>R$ ${order.total.toFixed(2)}</strong><br>
                <small class="text-muted">${getPaymentMethod(order.payment)}</small>
            </td>
            <td>
                <span class="badge-status ${getStatusClass(order.status)}">
                    ${getStatusText(order.status)}
                </span>
            </td>
            <td>${formatDate(order.date)}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="viewOrderDetail('${order.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-info" onclick="updateOrderStatus('${order.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-success" onclick="printOrder('${order.id}')">
                        <i class="bi bi-printer"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Configurar paginação
function setupPagination() {
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const pagination = document.getElementById('ordersPagination');
    
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

// Funções auxiliares
function getStatusClass(status) {
    const classes = {
        'pending': 'status-pending',
        'processing': 'status-processing',
        'shipped': 'status-shipped',
        'delivered': 'status-delivered',
        'cancelled': 'status-cancelled'
    };
    return classes[status] || 'status-pending';
}

function getStatusText(status) {
    const texts = {
        'pending': 'Pendente',
        'processing': 'Processando',
        'shipped': 'Enviado',
        'delivered': 'Entregue',
        'cancelled': 'Cancelado'
    };
    return texts[status] || 'Pendente';
}

function getPaymentMethod(payment) {
    const methods = {
        'credit_card': 'Cartão de Crédito',
        'pix': 'PIX',
        'boleto': 'Boleto',
        'debit_card': 'Cartão de Débito'
    };
    return methods[payment] || payment;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function addDays(dateString, days) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

function changePage(page) {
    currentPage = page;
    renderOrders();
    setupPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Ver detalhes do pedido
function viewOrderDetail(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    document.getElementById('orderId').textContent = order.id;
    
    document.getElementById('orderDetailContent').innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <div class="card bg-dark border-secondary mb-3">
                    <div class="card-header border-secondary">
                        <h6 class="mb-0"><i class="bi bi-box-seam me-2"></i>Itens do Pedido</h6>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-orders mb-0">
                                <thead>
                                    <tr>
                                        <th>Produto</th>
                                        <th width="100">Preço Unit.</th>
                                        <th width="80">Qtd</th>
                                        <th width="120">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${order.items.map(item => `
                                        <tr>
                                            <td>
                                                <strong>${item.name}</strong><br>
                                                <small class="text-muted">SKU: PROD-${Math.floor(Math.random() * 10000)}</small>
                                            </td>
                                            <td>R$ ${item.price.toFixed(2)}</td>
                                            <td>${item.quantity}</td>
                                            <td><strong>R$ ${(item.price * item.quantity).toFixed(2)}</strong></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div class="card bg-dark border-secondary">
                    <div class="card-header border-secondary">
                        <h6 class="mb-0"><i class="bi bi-truck me-2"></i>Informações de Entrega</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <strong>Endereço de Entrega</strong><br>
                                ${order.customer.name}<br>
                                ${order.shipping_address.street}<br>
                                ${order.shipping_address.city} - ${order.shipping_address.state}<br>
                                CEP: ${order.shipping_address.zip}
                            </div>
                            <div class="col-md-6">
                                <strong>Contato</strong><br>
                                ${order.customer.email}<br>
                                ${order.customer.phone}<br><br>
                                
                                ${order.tracking ? `
                                    <strong>Rastreamento</strong><br>
                                    <code>${order.tracking}</code><br>
                                    <button class="btn btn-sm btn-outline-primary mt-1" onclick="trackOrder('${order.id}')">
                                        <i class="bi bi-truck"></i> Acompanhar
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card bg-dark border-secondary mb-3">
                    <div class="card-header border-secondary">
                        <h6 class="mb-0"><i class="bi bi-info-circle me-2"></i>Resumo do Pedido</h6>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Subtotal:</span>
                            <span>R$ ${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Frete:</span>
                            <span>R$ ${order.shipping.toFixed(2)}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Desconto:</span>
                            <span>R$ 0,00</span>
                        </div>
                        <hr class="my-2">
                        <div class="d-flex justify-content-between">
                            <strong>Total:</strong>
                            <strong>R$ ${order.total.toFixed(2)}</strong>
                        </div>
                        
                        <div class="mt-3">
                            <div class="d-flex justify-content-between mb-1">
                                <small class="text-muted">Forma de pagamento:</small>
                                <small>${getPaymentMethod(order.payment)}</small>
                            </div>
                            <div class="d-flex justify-content-between mb-1">
                                <small class="text-muted">Status:</small>
                                <span class="badge-status ${getStatusClass(order.status)}">
                                    ${getStatusText(order.status)}
                                </span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <small class="text-muted">Data do pedido:</small>
                                <small>${formatDate(order.date)}</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card bg-dark border-secondary">
                    <div class="card-header border-secondary">
                        <h6 class="mb-0"><i class="bi bi-chat-left-text me-2"></i>Observações</h6>
                    </div>
                    <div class="card-body">
                        ${order.notes 
                            ? `<p class="mb-0">${order.notes}</p>`
                            : '<p class="text-muted mb-0"><i>Nenhuma observação</i></p>'
                        }
                    </div>
                </div>
                
                <div class="mt-3">
                    <button class="btn btn-primary w-100 mb-2" onclick="updateOrderStatus('${order.id}')">
                        <i class="bi bi-pencil"></i> Atualizar Status
                    </button>
                    <button class="btn btn-outline-light w-100" onclick="printOrder('${order.id}')">
                        <i class="bi bi-printer"></i> Imprimir Pedido
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
    modal.show();
}

// Atualizar status do pedido
function updateOrderStatus(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    document.getElementById('updateOrderId').value = orderId;
    document.getElementById('newStatus').value = order.status;
    document.getElementById('statusNotes').value = '';
    
    const modal = new bootstrap.Modal(document.getElementById('updateStatusModal'));
    modal.show();
}

function saveStatusUpdate() {
    const orderId = document.getElementById('updateOrderId').value;
    const newStatus = document.getElementById('newStatus').value;
    const notes = document.getElementById('statusNotes').value;
    
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    // Atualizar no array local
    allOrders[orderIndex].status = newStatus;
    
    if (newStatus === 'shipped') {
        allOrders[orderIndex].tracking = `BR${Date.now().toString().slice(-11)}`;
    }
    
    if (notes) {
        allOrders[orderIndex].notes = notes;
    }
    
    // Em um sistema real, aqui faria uma requisição para o backend
    console.log(`Atualizando pedido ${orderId} para status: ${newStatus}`);
    
    // Fechar modal
    bootstrap.Modal.getInstance(document.getElementById('updateStatusModal')).hide();
    
    // Atualizar interface
    updateOrderStats();
    applyFilters();
    
    alert(`✅ Status do pedido ${orderId} atualizado para "${getStatusText(newStatus)}"`);
}

// Acompanhar pedido
function trackOrder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order || !order.tracking) {
        alert('Este pedido ainda não possui código de rastreamento.');
        return;
    }
    
    // Simular janela de rastreamento
    const trackingWindow = window.open('', '_blank', 'width=600,height=400');
    trackingWindow.document.write(`
        <html>
        <head>
            <title>Rastreamento - Pedido ${orderId}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { padding: 20px; font-family: Arial, sans-serif; }
            </style>
        </head>
        <body>
            <h3>📦 Rastreamento do Pedido ${orderId}</h3>
            <div class="alert alert-info">
                <strong>Código de Rastreio:</strong> ${order.tracking}
            </div>
            
            <h5 class="mt-4">Histórico de Entrega:</h5>
            <div class="list-group">
                <div class="list-group-item">
                    <div class="d-flex w-100 justify-content-between">
                        <strong>Pedido recebido pela transportadora</strong>
                        <small>${formatDate(order.date)}</small>
                    </div>
                    <p class="mb-1">Centro de distribuição - São Paulo/SP</p>
                </div>
                <div class="list-group-item">
                    <div class="d-flex w-100 justify-content-between">
                        <strong>Pedido em trânsito</strong>
                        <small>${formatDate(addDays(order.date, 2))}</small>
                    </div>
                    <p class="mb-1">A caminho da cidade de destino</p>
                </div>
                <div class="list-group-item">
                    <div class="d-flex w-100 justify-content-between">
                        <strong>Pedido chegou à unidade local</strong>
                        <small>${formatDate(addDays(order.date, 5))}</small>
                    </div>
                    <p class="mb-1">${order.shipping_address.city} - ${order.shipping_address.state}</p>
                </div>
                <div class="list-group-item">
                    <div class="d-flex w-100 justify-content-between">
                        <strong>Saiu para entrega</strong>
                        <small>Hoje</small>
                    </div>
                    <p class="mb-1">Entregador em rota de entrega</p>
                </div>
            </div>
            
            <div class="mt-4">
                <a href="https://www.correios.com.br/" target="_blank" class="btn btn-primary">
                    <i class="bi bi-truck"></i> Ver no site dos Correios
                </a>
                <button onclick="window.close()" class="btn btn-secondary">Fechar</button>
            </div>
        </body>
        </html>
    `);
    trackingWindow.document.close();
}

// Imprimir pedido
function printOrder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>Pedido ${orderId}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
                .company { font-size: 24px; font-weight: bold; }
                .invoice-title { font-size: 18px; margin: 10px 0; }
                .section { margin: 20px 0; }
                .section-title { font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .total { text-align: right; font-weight: bold; font-size: 16px; margin-top: 20px; }
                .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
                @media print {
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="company">MINHA LOJA DROPSHIPPING</div>
                <div class="invoice-title">PEDIDO #${orderId}</div>
                <div>Data: ${formatDate(order.date)} | Status: ${getStatusText(order.status)}</div>
            </div>
            
            <div class="row">
                <div class="section">
                    <div class="section-title">Informações do Cliente</div>
                    <strong>${order.customer.name}</strong><br>
                    ${order.customer.email}<br>
                    ${order.customer.phone}<br>
                    ${order.shipping_address.street}<br>
                    ${order.shipping_address.city} - ${order.shipping_address.state}<br>
                    CEP: ${order.shipping_address.zip}
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">Itens do Pedido</div>
                <table>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Qtd</th>
                            <th>Preço Unit.</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>R$ ${item.price.toFixed(2)}</td>
                                <td>R$ ${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="section">
                <div class="section-title">Resumo Financeiro</div>
                <table>
                    <tr>
                        <td>Subtotal:</td>
                        <td align="right">R$ ${order.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Frete:</td>
                        <td align="right">R$ ${order.shipping.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td><strong>Total:</strong></td>
                        <td align="right"><strong>R$ ${order.total.toFixed(2)}</strong></td>
                    </tr>
                </table>
            </div>
            
            <div class="section">
                <div class="section-title">Informações Adicionais</div>
                <p><strong>Forma de Pagamento:</strong> ${getPaymentMethod(order.payment)}</p>
                ${order.tracking ? `<p><strong>Código de Rastreio:</strong> ${order.tracking}</p>` : ''}
                ${order.notes ? `<p><strong>Observações:</strong> ${order.notes}</p>` : ''}
            </div>
            
            <div class="footer">
                <p>Este é um comprovante de pedido gerado automaticamente.</p>
                <p>MINHA LOJA DROPSHIPPING - CNPJ: 12.345.678/0001-99</p>
                <p>Para dúvidas, entre em contato: suporte@minhaloja.com</p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px;">🖨️ Imprimir</button>
                <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; margin-left: 10px;">❌ Fechar</button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Exportar pedidos
function exportOrders() {
    if (!filteredOrders.length) {
        alert('Não há pedidos para exportar.');
        return;
    }
    
    let csv = 'ID;Data;Cliente;E-mail;Itens;Subtotal;Frete;Total;Status;Forma de Pagamento;Endereço\n';
    
    filteredOrders.forEach(order => {
        const items = order.items.map(item => `${item.name} (${item.quantity}x)`).join(', ');
        const address = `${order.shipping_address.street}, ${order.shipping_address.city} - ${order.shipping_address.state}`;
        
        csv += `"${order.id}";"${order.date}";"${order.customer.name}";"${order.customer.email}";"${items}";"${order.subtotal}";"${order.shipping}";"${order.total}";"${getStatusText(order.status)}";"${getPaymentMethod(order.payment)}";"${address}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pedidos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    alert(`📊 ${filteredOrders.length} pedidos exportados com sucesso!`);
}

// Atualizar lista de pedidos
function refreshOrders() {
    showLoading();
    
    // Simular recarregamento dos dados
    setTimeout(() => {
        // Em um sistema real, aqui faria uma requisição para atualizar os dados
        loadOrders();
        alert('🔄 Lista de pedidos atualizada!');
    }, 1000);
}

function showLoading() {
    const container = document.getElementById('ordersListContainer');
    container.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2">Carregando pedidos...</p>
        </div>
    `;
}

function hideLoading() {
    // A função renderOrders já atualiza a interface
}

// Exportar funções globais
window.loadOrders = loadOrders;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.filterByStatus = filterByStatus;
window.setViewMode = setViewMode;
window.changePage = changePage;
window.viewOrderDetail = viewOrderDetail;
window.updateOrderStatus = updateOrderStatus;
window.saveStatusUpdate = saveStatusUpdate;
window.trackOrder = trackOrder;
window.printOrder = printOrder;
window.exportOrders = exportOrders;
window.refreshOrders = refreshOrders;
window.logout = logout;