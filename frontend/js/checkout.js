// Sistema de Carrinho
const Cart = {
    getItems: () => JSON.parse(localStorage.getItem('cart')) || [],
    clearCart: () => localStorage.removeItem('cart'),
    getSubtotal: () => {
        const cart = Cart.getItems();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    getTotal: () => Cart.getSubtotal() + 10.00 // Frete fixo
};

// Carregar checkout
function loadCheckout() {
    const cartItems = Cart.getItems();
    
    if (cartItems.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    displayOrderItems(cartItems);
    updateOrderTotal();
}

// Exibir itens do pedido
function displayOrderItems(items) {
    const container = document.getElementById('order-items');
    container.innerHTML = '';
    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'd-flex justify-content-between mb-2';
        
        itemElement.innerHTML = `
            <span>${item.quantity}x ${item.name}</span>
            <span>R$ ${Number(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
        `;
        
        container.appendChild(itemElement);
    });
}

// Atualizar total do pedido
function updateOrderTotal() {
    const total = Cart.getTotal();
    document.getElementById('order-total').textContent = 
        `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Processar checkout
function processCheckout() {
    // Validar formulário
    const name = document.getElementById('customer-name').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    const city = document.getElementById('customer-city').value.trim();
    const zip = document.getElementById('customer-zip').value.trim();
    const payment = document.getElementById('payment-method').value;
    
    if (!name || !email || !address || !city || !zip) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }
    
    // Simular processamento
    const orderId = 'PED' + Date.now().toString().slice(-8);
    const orderDate = new Date().toLocaleDateString('pt-BR');
    const orderTotal = Cart.getTotal();
    
    // Mostrar tela de sucesso
    document.getElementById('checkout-form').style.display = 'none';
    
    const successDiv = document.getElementById('checkout-success');
    successDiv.style.display = 'block';
    successDiv.innerHTML = `
        <div class="text-center py-5">
            <div class="display-1 text-success mb-3">✅</div>
            <h2 class="mb-3">Compra Finalizada com Sucesso!</h2>
            <p class="lead">Obrigado por sua compra, ${name}!</p>
            
            <div class="card mt-4 mb-4">
                <div class="card-body">
                    <h5>📋 Resumo do Pedido</h5>
                    <div class="text-start">
                        <p><strong>Número do Pedido:</strong> ${orderId}</p>
                        <p><strong>Data:</strong> ${orderDate}</p>
                        <p><strong>Valor Total:</strong> R$ ${orderTotal.toFixed(2).replace('.', ',')}</p>
                        <p><strong>Forma de Pagamento:</strong> ${getPaymentMethodName(payment)}</p>
                        <p><strong>Endereço de Entrega:</strong> ${address}, ${city} - CEP: ${zip}</p>
                        <p><strong>Previsão de Entrega:</strong> 3-5 dias úteis</p>
                    </div>
                </div>
            </div>
            
            <p>Um e-mail de confirmação foi enviado para <strong>${email}</strong> (simulação).</p>
            
            <div class="alert alert-info mt-3">
                <small>
                    <strong>⚠️ Lembrete:</strong> Este é um sistema de demonstração. 
                    Nenhum pedido real foi criado e nenhum pagamento foi processado.
                </small>
            </div>
            
            <div class="mt-4">
                <a href="index.html" class="btn btn-primary me-2">Continuar Comprando</a>
                <button class="btn btn-outline-secondary" onclick="printOrder()">🖨️ Imprimir Recibo</button>
            </div>
        </div>
    `;
    
    // Limpar carrinho
    Cart.clearCart();
}

// Obter nome do método de pagamento
function getPaymentMethodName(method) {
    const methods = {
        'credit': 'Cartão de Crédito',
        'debit': 'Cartão de Débito',
        'pix': 'PIX',
        'boleto': 'Boleto Bancário'
    };
    return methods[method] || method;
}

// Imprimir recibo
function printOrder() {
    window.print();
}

// Inicializar
document.addEventListener('DOMContentLoaded', loadCheckout);