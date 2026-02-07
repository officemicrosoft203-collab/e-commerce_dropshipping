// ===============================
// PRODUTOS FAKE (MESMOS DO SITE)
// ===============================
const products = [
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

// ===============================
// PEGA ID DA URL
// ===============================
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"));
}

// ===============================
// CARREGA PRODUTO
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const productId = getProductIdFromURL();

    const loading = document.getElementById("loading");
    const error = document.getElementById("error-message");
    const details = document.getElementById("product-details");

    const product = products.find(p => p.id === productId);

    loading.style.display = "none";

    if (!product) {
        error.style.display = "block";
        return;
    }

    details.style.display = "block";

    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-price").textContent =
        `R$ ${product.price.toFixed(2)}`;

    document.getElementById("main-image-container").innerHTML = `
        <img src="${product.image}"
             class="main-image"
             alt="${product.name}"
             onerror="this.src='https://via.placeholder.com/400x400?text=Produto'">
    `;
});
window.addToCart = function () {
    addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
    });
};
