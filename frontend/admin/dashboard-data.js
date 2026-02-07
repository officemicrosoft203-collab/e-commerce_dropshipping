// ===============================
// DASHBOARD DATA ENGINE
// ===============================

// Produtos da loja (mesmos do products.js)
const productsDB = [
  { id: 1, name: "Mouse Gamer RGB", price: 89.90 },
  { id: 2, name: "Cadeira Gamer", price: 1299.90 },
  { id: 3, name: "Monitor 24\" Full HD", price: 899.90 },
  { id: 4, name: "Headset Gamer 7.1", price: 249.90 }
];

// Inicializar dados se não existirem
function initDashboardData() {
  if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify([]));
  }

  if (!localStorage.getItem("customers")) {
    localStorage.setItem("customers", JSON.stringify([]));
  }
}

initDashboardData();

// ===============================
// GERAR DADOS REALISTAS (SE VAZIO)
// ===============================
function generateFakeSales() {
  let orders = JSON.parse(localStorage.getItem("orders"));

  if (orders.length === 0) {
    for (let i = 0; i < 5; i++) {
      const product = productsDB[Math.floor(Math.random() * productsDB.length)];
      const qty = Math.floor(Math.random() * 3) + 1;

      orders.push({
        id: Date.now() + i,
        product: product.name,
        total: product.price * qty,
        date: new Date().toLocaleDateString("pt-BR"),
        customer: "Cliente " + (i + 1)
      });
    }
    localStorage.setItem("orders", JSON.stringify(orders));
  }
}

generateFakeSales();

// ===============================
// ATUALIZAR MÉTRICAS DO DASHBOARD
// ===============================
function updateDashboardStats() {
  const orders = JSON.parse(localStorage.getItem("orders"));

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;

  const customers = [...new Set(orders.map(o => o.customer))];

  setText("totalSales", `R$ ${totalSales.toFixed(2)}`);
  setText("totalOrders", totalOrders);
  setText("totalCustomers", customers.length);
  setText("totalProducts", productsDB.length);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

updateDashboardStats();

// ===============================
// NAVEGAÇÃO DOS BOTÕES (SEM MUDAR HTML)
// ===============================
function showSection(sectionId) {
  document.querySelectorAll(".dashboard-section").forEach(sec => {
    sec.style.display = "none";
  });

  const section = document.getElementById(sectionId);
  if (section) section.style.display = "block";
}

// ===============================
// LISTAGENS
// ===============================
function loadOrders() {
  const orders = JSON.parse(localStorage.getItem("orders"));
  const container = document.getElementById("ordersList");
  if (!container) return;

  container.innerHTML = "";

  orders.forEach(o => {
    container.innerHTML += `
      <tr>
        <td>#${o.id}</td>
        <td>${o.customer}</td>
        <td>${o.product}</td>
        <td>R$ ${o.total.toFixed(2)}</td>
        <td>${o.date}</td>
      </tr>
    `;
  });
}

function loadProducts() {
  const container = document.getElementById("productsList");
  if (!container) return;

  container.innerHTML = "";

  productsDB.forEach(p => {
    container.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>R$ ${p.price.toFixed(2)}</td>
      </tr>
    `;
  });
}

// ===============================
// AUTO LOAD
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  loadOrders();
  loadProducts();
});
