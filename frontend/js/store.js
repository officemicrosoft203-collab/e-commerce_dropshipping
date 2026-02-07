const Store = {
    getProducts() {
        return JSON.parse(localStorage.getItem('products')) || [];
    },

    saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    },

    getOrders() {
        return JSON.parse(localStorage.getItem('orders')) || [];
    },

    saveOrders(orders) {
        localStorage.setItem('orders', JSON.stringify(orders));
    },

    getCustomers() {
        return JSON.parse(localStorage.getItem('customers')) || [];
    },

    saveCustomers(customers) {
        localStorage.setItem('customers', JSON.stringify(customers));
    },

    getRevenue() {
        const orders = this.getOrders();
        return orders.reduce((total, order) => total + order.total, 0);
    }
};
