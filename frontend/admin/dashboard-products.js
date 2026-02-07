function showSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(sec => {
        sec.style.display = 'none';
    });

    document.getElementById(sectionId).style.display = 'block';

    if (sectionId === 'products') {
        loadAdminProducts();
    }
}

function loadAdminProducts() {
    const products = getStoreProducts();
    const table = document.getElementById('admin-products-table');

    table.innerHTML = '';

    if (products.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    Nenhum produto cadastrado
                </td>
            </tr>
        `;
        return;
    }

    products.forEach((product, index) => {
        table.innerHTML += `
            <tr>
                <td><img src="${product.image}" width="50" class="rounded"></td>
                <td>${product.name}</td>
                <td>R$ ${product.price.toFixed(2)}</td>
                <td>${product.category || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary"
                        onclick="editProduct(${index})">Editar</button>
                    <button class="btn btn-sm btn-outline-danger"
                        onclick="deleteProduct(${index})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function editProduct(index) {
    const products = getStoreProducts();
    const product = products[index];

    const name = prompt('Nome do produto:', product.name);
    const price = prompt('Preço:', product.price);

    if (!name || !price) return;

    product.name = name;
    product.price = parseFloat(price);

    products[index] = product;
    saveStoreProducts(products);

    loadAdminProducts();
    syncProductStats();
}

function deleteProduct(index) {
    if (!confirm('Deseja excluir este produto?')) return;

    const products = getStoreProducts();
    products.splice(index, 1);

    saveStoreProducts(products);

    loadAdminProducts();
    syncProductStats();
}
