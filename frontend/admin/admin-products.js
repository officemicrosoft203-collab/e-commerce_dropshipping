document.addEventListener("DOMContentLoaded", () => {
    const products = JSON.parse(localStorage.getItem("products")) || [];

    // TOTAL DE PRODUTOS
    const totalProductsEl = document.getElementById("totalProducts");
    if (totalProductsEl) {
        totalProductsEl.innerText = products.length;
    }

    // LISTA DE PRODUTOS
    const tableBody = document.getElementById("productsTable");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    products.forEach(product => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>R$ ${product.price.toFixed(2)}</td>
            <td>
                <span class="badge bg-success">Ativo</span>
            </td>
        `;

        tableBody.appendChild(row);
    });
});
