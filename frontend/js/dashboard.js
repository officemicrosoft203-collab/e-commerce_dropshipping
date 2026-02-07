document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
});

function updateDashboard() {
    const products = Store.getProducts();
    const orders = Store.getOrders();
    const customers = Store.getCustomers();
    const revenue = Store.getRevenue();

    // Receita total
    const revenueEl = document.getElementById('total-revenue');
    if (revenueEl) {
        revenueEl.innerText = revenue.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    // Pedidos de hoje
    const today = new Date().toDateString();
    const ordersToday = orders.filter(order =>
        new Date(order.date).toDateString() === today
    ).length;

    const ordersEl = document.getElementById('total-orders');
    if (ordersEl) {
        ordersEl.innerText = ordersToday;
    }

    // Produtos ativos
    const productsEl = document.getElementById('total-products');
    if (productsEl) {
        productsEl.innerText = products.length;
    }

    // Clientes ativos
    const customersEl = document.getElementById('total-customers');
    if (customersEl) {
        customersEl.innerText = customers.length;
    }
}
