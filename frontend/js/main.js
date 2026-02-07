// Funções gerais da aplicação
console.log('Aplicação Minha Loja Online carregada!');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada');
    
    // Verificar autenticação
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
        updateUserMenu(true);
    }
    
    // Configurar tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Atualizar menu do usuário
function updateUserMenu(isLoggedIn) {
    const userDropdown = document.querySelector('#userDropdown');
    if (!userDropdown) return;
    
    if (isLoggedIn) {
        const userName = localStorage.getItem('userName') || 'Usuário';
        userDropdown.innerHTML = `
            <i class="bi bi-person-circle me-1"></i> ${userName}
        `;
        
        const dropdownMenu = userDropdown.nextElementSibling;
        dropdownMenu.innerHTML = `
            <li><a class="dropdown-item" href="profile.html"><i class="bi bi-person me-2"></i>Meu Perfil</a></li>
            <li><a class="dropdown-item" href="orders.html"><i class="bi bi-receipt me-2"></i>Meus Pedidos</a></li>
            <li><a class="dropdown-item" href="favorites.html"><i class="bi bi-heart me-2"></i>Favoritos</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" onclick="logout()"><i class="bi bi-box-arrow-right me-2"></i>Sair</a></li>
        `;
    }
}

// Logout
function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    updateUserMenu(false);
    showToast('Você saiu da sua conta', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Mostrar notificação
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || (() => {
        const div = document.createElement('div');
        div.id = 'toastContainer';
        div.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(div);
        return div;
    })();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}