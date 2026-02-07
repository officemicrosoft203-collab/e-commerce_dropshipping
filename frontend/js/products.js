// ===============================
// GERENCIADOR DE PRODUTOS
// ===============================
class ProductManager {
    constructor() {
        this.products = [];
    }

    async loadProducts() {
        try {
            const response = await fetch('/api/products');
            if (response.ok) {
                this.products = await response.json();
            } else {
                this.products = this.getDefaultProducts();
            }
        } catch (error) {
            this.products = this.getDefaultProducts();
        }

        // 🔥 SALVA NO LOCALSTORAGE PARA O ADMIN USAR
        localStorage.setItem("products", JSON.stringify(this.products));
    }

    getDefaultProducts() {
        return [
            {
                id: 1,
                name: "Mouse Gamer RGB",
                description: "Mouse com iluminação RGB, 6 botões programáveis.",
                price: 89.90,
                image: "uploads/mouse.jpg"
            },
            {
                id: 2,
                name: "Cadeira Gamer",
                description: "Cadeira ergonômica com ajuste de altura e apoio lombar.",
                price: 1299.90,
                image: "uploads/cadeira.jpg"
            },
            {
                id: 3,
                name: "Monitor 24\" Full HD",
                description: "Monitor 144Hz, 1ms, ideal para jogos e trabalho.",
                price: 899.90,
                image: "uploads/monitor.jpg"
            },
            {
                id: 4,
                name: "Headset Gamer 7.1",
                description: "Headset surround virtual, microfone com cancelamento de ruído.",
                price: 249.90,
                image: "uploads/headset.jpg"
            }
        ];
    }
}

const productManager = new ProductManager();

document.addEventListener("DOMContentLoaded", async () => {
    await productManager.loadProducts();

    const container = document.getElementById("productsContainer");
    if (!container) return;

    productManager.products.forEach(product => {
        const col = document.createElement("div");
        col.className = "col-md-3";

        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${product.image}" class="card-img-top p-3"
                     style="height:200px; object-fit:contain"
                     onerror="this.src='https://via.placeholder.com/300x200?text=Produto'">
                <div class="card-body d-flex flex-column">
                    <h6 class="fw-bold">${product.name}</h6>
                    <p class="text-muted small">${product.description}</p>
                    <strong class="text-success mb-2">
                        R$ ${product.price.toFixed(2)}
                    </strong>
                    <a href="product.html?id=${product.id}"
                       class="btn btn-sm btn-primary mt-auto">
                        Ver detalhes
                    </a>
                </div>
            </div>
        `;

        container.appendChild(col);
    });
});
