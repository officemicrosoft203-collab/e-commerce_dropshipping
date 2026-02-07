// admin-charts-restore.js (guardado e não intrusivo) - versão com proteção contra múltiplas inicializações
(function () {
  if (typeof Chart === 'undefined') {
    console.warn('admin-charts-restore: Chart.js não encontrado.');
    return;
  }

  // FLAGS GLOBAIS (previne execuções repetidas)
  if (window.__admin_charts_restore_loaded) {
    console.info('admin-charts-restore: já carregado — saindo.');
    return;
  }
  window.__admin_charts_restore_loaded = true;

  // Helpers de data
  function formatLabelDate(d) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  }
  function lastNDates(n) {
    const arr = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      arr.push(d);
    }
    return arr;
  }

  // Agregadores (tentam usar AppState se existir)
  function aggregateSalesFromOrders(days) {
    if (!window.AppState || !Array.isArray(window.AppState.orders) || window.AppState.orders.length === 0) return null;
    const map = {};
    const dates = lastNDates(days).map(d => {
      const key = d.toISOString().slice(0, 10);
      map[key] = 0;
      return key;
    });
    window.AppState.orders.forEach(order => {
      const dStr = order.date || order.createdAt || order.created_at || order.timestamp || null;
      const total = Number(order.total ?? order.value ?? order.amount ?? 0) || 0;
      if (!dStr) return;
      const d = new Date(dStr);
      if (isNaN(d)) return;
      const key = d.toISOString().slice(0, 10);
      if (key in map) map[key] += total;
    });
    return dates.map(k => Math.round(map[k] * 100) / 100);
  }
  function computeCategoriesData() {
    if (window.AppState && Array.isArray(window.AppState.products) && window.AppState.products.length) {
      const counts = {};
      window.AppState.products.forEach(p => {
        const cat = p.category || p.categoryName || p.category_slug || p.category_id || 'Outros';
        counts[cat] = (counts[cat] || 0) + (p.soldCount || p.sales || 0);
      });
      const labels = Object.keys(counts);
      const data = labels.map(l => counts[l] || 0);
      if (labels.length) return { labels, data };
    }
    if (window.AppState && Array.isArray(window.AppState.orders) && window.AppState.orders.length) {
      const counts = {};
      window.AppState.orders.forEach(o => {
        (o.items || []).forEach(it => {
          const cat = it.category || it.productCategory || 'Outros';
          counts[cat] = (counts[cat] || 0) + (it.quantity || it.qty || 1);
        });
      });
      const labels = Object.keys(counts);
      const data = labels.map(l => counts[l] || 0);
      if (labels.length) return { labels, data };
    }
    return { labels: ['Eletrônicos', 'Informática', 'Games', 'Escritório', 'Outros'], data: [35, 20, 18, 12, 15] };
  }

  // Cria/Atualiza salesChart
  function createOrUpdateSalesChart(days = 30) {
    const salesEl = document.getElementById('salesChart');
    if (!salesEl) return;
    const labelsDates = lastNDates(days);
    const labels = labelsDates.map(formatLabelDate);
    const aggregated = aggregateSalesFromOrders(days);
    const dataPoints = aggregated || labels.map(() => Math.floor(Math.random() * 2200) + 200);

    // inicializar ou atualizar
    if (window.AppState && window.AppState.salesChart) {
      const ch = window.AppState.salesChart;
      ch.data.labels = labels;
      ch.data.datasets[0].data = dataPoints;
      ch.update();
      return ch;
    }

    const ctx = salesEl.getContext('2d');
    const cfg = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Vendas (R$)',
          data: dataPoints,
          borderColor: '#5B8BF7',
          backgroundColor: 'rgba(91,139,247,0.08)',
          pointBackgroundColor: '#5B8BF7',
          pointRadius: 3,
          tension: 0.35,
          fill: true,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: {
          x: { grid: { display: false, color: 'rgba(255,255,255,0.03)' }, ticks: { color: 'rgba(226,232,240,0.75)' } },
          y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: 'rgba(226,232,240,0.75)', callback: v => 'R$ ' + v } }
        }
      }
    };
    try {
      const chart = new Chart(ctx, cfg);
      if (window.AppState) window.AppState.salesChart = chart;
      return chart;
    } catch (err) {
      console.error('admin-charts-restore: erro ao criar salesChart', err);
      return null;
    }
  }

  // Cria/Atualiza categoryChart
  function createOrUpdateCategoryChart() {
    const catEl = document.getElementById('categoryChart');
    if (!catEl) return;
    const cat = computeCategoriesData();

    // atualizar se já existe
    if (window.AppState && window.AppState.categoryChart) {
      const ch = window.AppState.categoryChart;
      ch.data.labels = cat.labels;
      ch.data.datasets[0].data = cat.data;
      ch.update();
      return ch;
    }

    const ctx = catEl.getContext('2d');
    const cfg = {
      type: 'doughnut',
      data: { labels: cat.labels, datasets: [{ data: cat.data, backgroundColor: ['#3B82F6', '#7C3AED', '#06B6D4', '#F43F5E', '#60A5FA', '#F59E0B', '#10B981'], hoverOffset: 6 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: 'rgba(226,232,240,0.9)' } } } }
    };
    try {
      const chart = new Chart(ctx, cfg);
      if (window.AppState) window.AppState.categoryChart = chart;
      return chart;
    } catch (err) {
      console.error('admin-charts-restore: erro ao criar categoryChart', err);
      return null;
    }
  }

  // Inicializador seguro: cria/atualiza charts uma vez (ou atualiza se já existirem)
  function initChartsSafe(days = 30) {
    try {
      createOrUpdateSalesChart(days);
      createOrUpdateCategoryChart();
      console.info('admin-charts-restore: initChartsSafe executado');
    } catch (err) {
      console.error('admin-charts-restore: erro em initChartsSafe', err);
    }
  }

  // Garante que initDashboard só seja "wrapado" uma vez e define flag para prevenir múltiplas execuções
  function patchInitDashboardOnce() {
    if (window.__initDashboard_patched) return;
    if (typeof window.initDashboard !== 'function') return;
    window.__initDashboard_patched = true;
    const orig = window.initDashboard;
    window.initDashboard = function wrappedInitDashboard() {
      // se já inicializou o dashboard antes, não reexecuta
      if (window.__dashboard_initialized) {
        console.info('initDashboard: já inicializado — ignorando chamada.');
        return;
      }
      const res = orig.apply(this, arguments);
      // marca como inicializado para evitar re-runs
      window.__dashboard_initialized = true;
      // aguarda injeção do HTML e atualiza charts
      setTimeout(() => initChartsSafe(30), 120);
      return res;
    };
  }

  // Se initDashboard já existe no momento do load, aplica patch; senão observa e aplica quando definida
  function ensurePatch() {
    patchInitDashboardOnce();
    if (!window.__initDashboard_patched) {
      // observa criação da função (caso scripts posteriores definam initDashboard)
      const mo = new MutationObserver(() => {
        patchInitDashboardOnce();
      });
      mo.observe(document, { childList: true, subtree: true });
      // também tentamos a cada 200ms por 1.5s (fallback)
      let tries = 0;
      const interval = setInterval(() => {
        patchInitDashboardOnce();
        tries++;
        if (window.__initDashboard_patched || tries > 8) clearInterval(interval);
      }, 200);
    }
  }

  // Expor updateChart globalmente (atualiza sem recriar)
  window.updateChart = function(days) {
    days = Number(days) || 30;
    initChartsSafe(days);
  };

  // Inicialização: tenta patchar e também executar charts caso o dashboard já esteja renderizado
  document.addEventListener('DOMContentLoaded', () => {
    ensurePatch();
    // Execução inicial segura: se os canvases já estiverem no DOM (dashboard já injetado por algum script), inicializa sem recriar depois
    setTimeout(() => initChartsSafe(30), 200);
  });
})();