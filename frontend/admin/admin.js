'use strict';

const API_URL = 'http://localhost:5000/api';
let products = [];

function loadDashboardStats() {
    fetch(`${API_URL}/stats`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            document.getElementById('total-products').textContent = data.totalProducts || 0;
            document.getElementById('today-orders').textContent = data.todayOrders || 0;
            document.getElementById('total-users').textContent = data.totalUsers || 0;
            document.getElementById('total-revenue').textContent = 
                `R$ ${(data.totalRevenue || 0).toFixed(2).replace('.', ',')}`;
        }
    })
    .catch(err => console.error('Erro stats:', err));
}

function loadProducts() {
    fetch(`${API_URL}/products`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                products = data.products;
                renderProductsTable();
            }
        })
        .catch(err => console.error('Erro produtos:', err));
}

function renderProductsTable() {
    const tbody = document.getElementById('products-table');
    if (!tbody) return;

    if (!products.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    <i class="fas fa-box-open"></i> Nenhum produto cadastrado
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>R$ ${Number(product.price).toFixed(2).replace('.', ',')}</td>
            <td>${product.description ? product.description.substring(0, 50) + '...' : '-'}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger ms-1" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function addProduct() {
    const form = document.getElementById('add-product-form');
    const formData = new FormData();
    
    formData.append('name', form.name.value);
    formData.append('price', form.price.value);
    formData.append('description', form.description.value);
    formData.append('image_url', form.image_url.value);
    
    const fileInput = document.getElementById('image-file');
    if (fileInput.files[0]) {
        formData.append('image', fileInput.files[0]);
    }

    fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('✅ Produto adicionado com sucesso!');
            bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
            form.reset();
            loadProducts();
            loadDashboardStats();
        } else {
            alert('❌ Erro: ' + (data.error || 'Falha ao adicionar'));
        }
    })
    .catch(err => {
        console.error('Erro:', err);
        alert('❌ Erro ao conectar com o servidor');
    });
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const newName = prompt('Novo nome:', product.name);
    if (!newName) return;
    
    const newPrice = prompt('Novo preço:', product.price);
    if (!newPrice) return;
    
    fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: newName,
            price: parseFloat(newPrice),
            description: product.description
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('✅ Produto atualizado!');
            loadProducts();
        } else {
            alert('❌ Erro: ' + data.error);
        }
    })
    .catch(err => {
        console.error('Erro:', err);
        alert('❌ Erro ao atualizar');
    });
}

function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('✅ Produto excluído!');
            loadProducts();
            loadDashboardStats();
        } else {
            alert('❌ Erro: ' + data.error);
        }
    })
    .catch(err => {
        console.error('Erro:', err);
        alert('❌ Erro ao excluir');
    });
}

function loadRecentOrders() {
    fetch(`${API_URL}/orders/recent`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    })
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('recent-orders');
        if (!container) return;
        
        if (data.success && data.orders.length) {
            container.innerHTML = data.orders.map(order => `
                <div class="border-bottom pb-2 mb-2">
                    <div class="d-flex justify-content-between">
                        <strong>Pedido #${order.id}</strong>
                        <span class="badge bg-success">R$ ${order.total.toFixed(2)}</span>
                    </div>
                    <small class="text-muted">${new Date(order.created_at).toLocaleDateString('pt-BR')}</small>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-muted text-center py-3"><i class="fas fa-info-circle"></i> Nenhum pedido recente</p>';
        }
    })
    .catch(err => console.error('Erro pedidos:', err));
}

function loadOrders() {
    alert('Funcionalidade de pedidos será implementada em breve!');
}