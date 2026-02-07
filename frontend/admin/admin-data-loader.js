// Carregador de Dados da Loja
class AdminDataLoader {
    constructor() {
        this.products = this.loadProducts();
        this.orders = this.loadOrders();
        this.customers = this.loadCustomers();
    }
    
    loadProducts() {
        // Tenta carregar do localStorage (salvos pelo site)
        const stored = localStorage.getItem('products');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Dados padrão se não houver
        return [
            { id: 1, name: 'Mouse Gamer RGB', price: 89.90, category: 'Periféricos', stock: 15, sales: 142, image: 'uploads/mouse.jpg' },
            { id: 2, name: 'Teclado Mecânico', price: 299.90, category: 'Periféricos', stock: 8, sales: 98, image: 'uploads/keyboard.jpg' },
            { id: 3, name: 'Monitor 24\" Full HD', price: 899.90, category: 'Monitores', stock: 22, sales: 76, image: 'uploads/monitor.jpg' },
            { id: 4, name: 'Headset Gamer 7.1', price: 249.90, category: 'Áudio', stock: 12, sales: 65, image: 'uploads/headset.jpg' },
            { id: 5, name: 'Cadeira Gamer', price: 1299.90, category: 'Móveis', stock: 5, sales: 42, image: 'uploads/cadeira.jpg' }
        ];
    }
    
    loadOrders() {
        const stored = localStorage.getItem('orders');
        if (stored) {
            return JSON.parse(stored);
        }
        
        return [
            {
                id: 'ORD-001',
                customer: 'João Silva',
                total: 249.90,
                status: 'Entregue',
                date: new Date().toISOString().split('T')[0],
                items: [{ name: 'Mouse Gamer RGB', qty: 1, price: 89.90 }]
            },
            {
                id: 'ORD-002',
                customer: 'Maria Santos',
                total: 399.90,
                status: 'Em transporte',
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                items: [{ name: 'Teclado Mecânico', qty: 1, price: 299.90 }]
            },
            {
                id: 'ORD-003',
                customer: 'Pedro Costa',
                total: 189.90,
                status: 'Processando',
                date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
                items: [{ name: 'Headset Gamer 7.1', qty: 1, price: 249.90 }]
            }
        ];
    }
    
    loadCustomers() {
        const stored = localStorage.getItem('customers');
        if (stored) {
            return JSON.parse(stored);
        }
        
        return [
            { id: 1, name: 'João Silva', email: 'joao@email.com', city: 'São Paulo', orders: 5, spent: 2450.50 },
            { id: 2, name: 'Maria Santos', email: 'maria@email.com', city: 'Rio de Janeiro', orders: 3, spent: 1240.30 },
            { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', city: 'Belo Horizonte', orders: 8, spent: 4890.70 },
            { id: 4, name: 'Ana Oliveira', email: 'ana@email.com', city: 'Salvador', orders: 2, spent: 599.80 }
        ];
    }
    
    getStats() {
        return {
            totalProducts: this.products.length,
            totalRevenue: this.orders.reduce((sum, o) => sum + o.total, 0),
            totalOrders: this.orders.length,
            totalCustomers: this.customers.length,
            ordersToday: this.orders.filter(o => o.date === new Date().toISOString().split('T')[0]).length
        };
    }
}

const dataLoader = new AdminDataLoader();
window.dataLoader = dataLoader;