// frontend/admin/products-management.js
'use strict';

const API_URL = 'http://localhost:5001/api';
let allProducts = [];
let currentPage = 1;
const itemsPerPage = 10;

// Carregar produtos
async function loadProducts() {
    try {
        showLoading();
        
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        
        if (data.success) {
            allProducts = data.products || [];
            updateStats(allProducts);
            renderProductsTable();
            setupPagination();
        } else {
            throw new Error(data.error || 'Erro ao carregar produtos');
        }
        
    } catch (error) {
        console.error('Erro:', error);
        showError('Erro ao carregar produtos');
    }
}

// Atualizar estatísticas
function updateStats(products) {
    const totalProducts = products.length;
    const lowStock = products.filter(p => p.stock < 10 && p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('lowStockProducts').textContent = lowStock;
    document.getElementById('outOfStock').textContent = outOfStock;
    document.getElementById('totalValue').textContent = 
        `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

// Renderizar tabela de produtos
function renderProductsTable(filteredProducts = allProducts) {
    const tbody = document.getElementById('productsTableBody');
    
    if (!filteredProducts.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-5">
                    <div class="text-muted">
                        <i class="bi bi-box-open fs-1"></i>
                        <h5 class="mt-3">Nenhum produto encontrado</h5>
                        <p>Clique em "Novo Produto" para adicionar seu primeiro produto</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Paginação
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageProducts = filteredProducts.slice(start, end);
    
    tbody.innerHTML = pageProducts.map(product => `
        <tr>
            <td>
                ${product.image_url 
                    ? `<img src="${API_URL}${product.image_url}" class="product-image">`
                    : `<div class="product-image d-flex align-items-center justify-content-center">
                         <i class="bi bi-box text-muted"></i>
                       </div>`
                }
            </td>
            <td>
                <strong>${product.name}</strong><br>
                <small class="text-muted">${product.description?.substring(0, 60) || 'Sem descrição'}...</small>
            </td>
            <td>
                <span class="badge-category">${getCategoryName(product.category)}</span>
            </td>
            <td>
                <strong>R$ ${product.price.toFixed(2)}</strong><br>
                <small class="text-muted">Custo: R$ ${(product.price * 0.6).toFixed(2)}</small>
            </td>
            <td>
                ${getStockBadge(product.stock)}
            </td>
            <td>
                <strong>${Math.floor(Math.random() * 100)}</strong><br>
                <small class="text-muted">vendas</small>
            </td>
            <td>
                ${product.stock > 0 
                    ? '<span class="badge bg-success">Ativo</span>'
                    : '<span class="badge bg-danger">Inativo</span>'
                }
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editProduct(${product.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-info" onclick="viewProduct(${product.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteProduct(${product.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Atualizar contadores
    document.getElementById('showingCount').textContent = pageProducts.length;
    document.getElementById('totalCount').textContent = filteredProducts.length;
}

// Configurar paginação
function setupPagination() {
    const totalPages = Math.ceil(allProducts.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
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
function getCategoryName(category) {
    const categories = {
        'eletronicos': 'Eletrônicos',
        'informatica': 'Informática',
        'games': 'Games',
        'escritorio': 'Escritório',
        'moveis': 'Móveis',
        'vestuario': 'Vestuário'
    };
    return categories[category] || 'Outros';
}

function getStockBadge(stock) {
    if (stock === 0) {
        return `<span class="stock-out"><i class="bi bi-x-circle"></i> Esgotado</span>`;
    } else if (stock < 10) {
        return `<span class="stock-low"><i class="bi bi-exclamation-triangle"></i> ${stock} un.</span>`;
    } else {
        return `<span class="stock-ok"><i class="bi bi-check-circle"></i> ${stock} un.</span>`;
    }
}

function changePage(page) {
    currentPage = page;
    renderProductsTable();
    setupPagination();
}

// Filtrar produtos
function applyFilters() {
    const search = document.getElementById('searchProduct').value.toLowerCase();
    const category = document.getElementById('filterCategory').value;
    const stock = document.getElementById('filterStock').value;
    
    let filtered = [...allProducts];
    
    // Busca por nome/descrição
    if (search) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(search) ||
            (p.description && p.description.toLowerCase().includes(search))
        );
    }
    
    // Filtrar por categoria
    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }
    
    // Filtrar por estoque
    if (stock === 'low') {
        filtered = filtered.filter(p => p.stock < 10 && p.stock > 0);
    } else if (stock === 'out') {
        filtered = filtered.filter(p => p.stock === 0);
    } else if (stock === 'ok') {
        filtered = filtered.filter(p => p.stock >= 10);
    }
    
    currentPage = 1;
    renderProductsTable(filtered);
    setupPagination(filtered.length);
}

// Salvar produto
async function saveProduct() {
    const form = document.getElementById('productForm');
    const formData = new FormData(form);
    
    const product = {
        name: formData.get('name'),
        price: parseFloat(formData.get('price')),
        cost_price: parseFloat(formData.get('cost_price')),
        description: formData.get('description'),
        category: formData.get('category'),
        stock: parseInt(formData.get('stock')),
        specs: formData.get('specs'),
        supplier: formData.get('supplier'),
        supplier_url: formData.get('supplier_url')
    };
    
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(product)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ Produto salvo com sucesso!');
            
            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
            modal.hide();
            
            // Limpar formulário
            form.reset();
            
            // Recarregar produtos
            loadProducts();
            
        } else {
            throw new Error(data.error);
        }
        
    } catch (error) {
        console.error('Erro:', error);
        alert(`❌ Erro ao salvar produto: ${error.message}`);
    }
}

// Editar produto
async function editProduct(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;
    
    const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
    
    document.getElementById('editProductForm').innerHTML = `
        <form onsubmit="updateProduct(${id}); return false;">
            <div class="mb-3">
                <label class="form-label">Nome do Produto</label>
                <input type="text" class="form-control bg-dark border-secondary text-light" 
                       value="${product.name}" required>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Preço (R$)</label>
                    <input type="number" step="0.01" class="form-control bg-dark border-secondary text-light" 
                           value="${product.price}" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Estoque</label>
                    <input type="number" class="form-control bg-dark border-secondary text-light" 
                           value="${product.stock || 0}" required>
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label">Descrição</label>
                <textarea class="form-control bg-dark border-secondary text-light" rows="3">${product.description || ''}</textarea>
            </div>
            <div class="modal-footer border-secondary">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-primary">Salvar Alterações</button>
            </div>
        </form>
    `;
    
    modal.show();
}

async function updateProduct(id) {
    const form = document.querySelector('#editProductForm form');
    const inputs = form.querySelectorAll('input, textarea');
    
    const updates = {
        name: inputs[0].value,
        price: parseFloat(inputs[1].value),
        stock: parseInt(inputs[2].value),
        description: inputs[3].value
    };
    
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(updates)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ Produto atualizado!');
            bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
            loadProducts();
        } else {
            throw new Error(data.error);
        }
        
    } catch (error) {
        alert(`❌ Erro: ${error.message}`);
    }
}

// Deletar produto
async function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?\nEsta ação não pode ser desfeita.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ Produto excluído!');
            loadProducts();
        } else {
            throw new Error(data.error);
        }
        
    } catch (error) {
        alert(`❌ Erro: ${error.message}`);
    }
}

function viewProduct(id) {
    const product = allProducts.find(p => p.id === id);
    if (product) {
        alert(`Visualizando: ${product.name}\n\nDescrição: ${product.description || 'N/A'}\nPreço: R$ ${product.price.toFixed(2)}\nEstoque: ${product.stock || 0} unidades`);
    }
}

function exportProducts() {
    // Simular exportação CSV
    let csv = 'Nome;Categoria;Preço;Estoque;Status\n';
    
    allProducts.forEach(p => {
        csv += `"${p.name}";"${getCategoryName(p.category)}";"R$ ${p.price.toFixed(2)}";"${p.stock}";"${p.stock > 0 ? 'Ativo' : 'Inativo'}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'produtos_' + new Date().toISOString().split('T')[0] + '.csv';
    a.click();
    
    alert('📊 Produtos exportados com sucesso!');
}

function refreshProducts() {
    loadProducts();
    alert('🔄 Lista de produtos atualizada!');
}

function showLoading() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-5">
                <div class="spinner-border text-primary"></div>
                <p class="mt-2">Carregando produtos...</p>
            </td>
        </tr>
    `;
}

function showError(message) {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-5">
                <div class="text-danger">
                    <i class="bi bi-exclamation-triangle fs-1"></i>
                    <h5 class="mt-3">Erro ao carregar produtos</h5>
                    <p>${message}</p>
                    <button class="btn btn-primary mt-2" onclick="loadProducts()">
                        Tentar Novamente
                    </button>
                </div>
            </td>
        </tr>
    `;
}

// Exportar funções globais
window.loadProducts = loadProducts;
window.applyFilters = applyFilters;
window.changePage = changePage;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.viewProduct = viewProduct;
window.exportProducts = exportProducts;
window.refreshProducts = refreshProducts;
window.saveProduct = saveProduct;