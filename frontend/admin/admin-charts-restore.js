// admin-charts-restore.js (API-enabled, JWT via localStorage key "adminToken")
// Substitua o arquivo frontend/admin/admin-charts-restore.js por este.

(function () {
  if (typeof Chart === 'undefined') {
    console.warn('admin-charts-restore: Chart.js não encontrado.');
    return;
  }

  if (window.__admin_charts_restore_loaded) {
    console.info('admin-charts-restore: já carregado — saindo.');
    return;
  }
  window.__admin_charts_restore_loaded = true;

  const API_CONFIG = {
    endpoints: {
      orders: '/api/orders',
      products: '/api/products',
      customers: '/api/users' // usamos /api/users (userRoutes). Ajuste se necessário.
    },
    useCredentials: false, // se usa cookie de sessão, mude para true
    authHeaderName: 'Authorization',
    getToken: () => localStorage.getItem('adminToken'),
    fetchTimeoutMs: 8000
  };

  // desativa animações globais do Chart.js
  try {
    if (Chart.defaults && typeof Chart.defaults === 'object') {
      Chart.defaults.animation = false;
      if (Chart.defaults.elements && Chart.defaults.elements.line) Chart.defaults.elements.line.tension = 0;
    }
  } catch (e) { console.warn(e); }

  function formatLabelDate(d) { const day = String(d.getDate()).padStart(2,'0'); const month = String(d.getMonth()+1).padStart(2,'0'); return `${day}/${month}`; }
  function lastNDates(n) { const arr=[]; const today=new Date(); for (let i=n-1;i>=0;i--){ const d=new Date(today); d.setDate(today.getDate()-i); arr.push(d);} return arr; }
  function tryParseDateString(str) { if (!str) return null; const dIso=new Date(str); if (!isNaN(dIso)) return dIso; const m=String(str).match(/(\d{2})\/(\d{2})\/(\d{4})/); if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}T00:00:00`); return null; }
  function fetchWithTimeout(url, opts={}, timeout=8000) { return Promise.race([ fetch(url, opts), new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')), timeout)) ]); }

  async function fetchApiData() {
    const token = API_CONFIG.getToken && API_CONFIG.getToken();
    const commonOpts = { method: 'GET', headers: { 'Accept': 'application/json' }, credentials: API_CONFIG.useCredentials ? 'include' : 'same-origin' };
    if (token && !API_CONFIG.useCredentials) commonOpts.headers[API_CONFIG.authHeaderName] = `Bearer ${token}`;

    try {
      const [ro, rp, rc] = await Promise.all([
        fetchWithTimeout(API_CONFIG.endpoints.orders, commonOpts, API_CONFIG.fetchTimeoutMs),
        fetchWithTimeout(API_CONFIG.endpoints.products, commonOpts, API_CONFIG.fetchTimeoutMs),
        fetchWithTimeout(API_CONFIG.endpoints.customers, commonOpts, API_CONFIG.fetchTimeoutMs)
      ]);
      if (!ro.ok || !rp.ok || !rc.ok) throw new Error('Alguma resposta não OK');
      const [orders, products, customers] = await Promise.all([ro.json().catch(()=>[]), rp.json().catch(()=>[]), rc.json().catch(()=>[])]);
      return { orders: orders || [], products: products || [], customers: customers || [] };
    } catch (err) {
      console.warn('admin-charts-restore: API falhou, fallback localStorage ->', err.message);
      return null;
    }
  }

  function loadLocalData() {
    try {
      return {
        orders: JSON.parse(localStorage.getItem('orders')) || [],
        products: JSON.parse(localStorage.getItem('products')) || [],
        customers: JSON.parse(localStorage.getItem('customers')) || []
      };
    } catch (e) {
      return { orders: [], products: [], customers: [] };
    }
  }

  function normalizeAndSetAppState({ orders = [], products = [], customers = [] }) {
    const normOrders = (orders||[]).map(o => {
      const total = Number(o.total ?? o.amount ?? o.value) || 0;
      const parsed = tryParseDateString(o.date || o.createdAt || o.created_at || o.timestamp);
      return Object.assign({}, o, { total, date: parsed ? parsed.toISOString() : (o.date || null) });
    });
    if (!window.AppState) window.AppState = {};
    window.AppState.orders = normOrders;
    window.AppState.products = products || [];
    window.AppState.customers = customers || [];
  }

  function aggregateSalesFromOrders(days) {
    if (!window.AppState || !Array.isArray(window.AppState.orders) || window.AppState.orders.length === 0) return null;
    const map = {}; const dates = lastNDates(days).map(d => { const k = d.toISOString().slice(0,10); map[k]=0; return k; });
    window.AppState.orders.forEach(o => {
      const dStr = o.date || o.createdAt || o.created_at || o.timestamp || null;
      const total = Number(o.total ?? o.value ?? o.amount ?? 0) || 0;
      if (!dStr) return;
      const d = new Date(dStr); if (isNaN(d)) return;
      const k = d.toISOString().slice(0,10); if (k in map) map[k] += total;
    });
    return dates.map(k => Math.round(map[k]*100)/100);
  }

  function computeCategoriesData() {
    if (window.AppState && Array.isArray(window.AppState.products) && window.AppState.products.length) {
      const counts = {};
      window.AppState.products.forEach(p => {
        const cat = p.category || p.categoryName || p.category_slug || p.category_id || 'Outros';
        counts[cat] = (counts[cat]||0) + (p.soldCount || p.sales || 0);
      });
      const labels = Object.keys(counts); const data = labels.map(l => counts[l] || 0);
      if (labels.length) return { labels, data };
    }
    if (window.AppState && Array.isArray(window.AppState.orders) && window.AppState.orders.length) {
      const counts = {};
      window.AppState.orders.forEach(o => (o.items||[]).forEach(it => {
        const cat = it.category || it.productCategory || 'Outros';
        counts[cat] = (counts[cat]||0) + (it.quantity || it.qty || 1);
      }));
      const labels = Object.keys(counts); const data = labels.map(l => counts[l] || 0);
      if (labels.length) return { labels, data };
    }
    return { labels: ['Eletrônicos','Informática','Games','Escritório','Outros'], data: [35,20,18,12,15] };
  }

  function createOrUpdateSalesChart(days = 30) {
    const el = document.getElementById('salesChart'); if (!el) return;
    const labels = lastNDates(days).map(formatLabelDate); const aggregated = aggregateSalesFromOrders(days);
    const dataPoints = aggregated || labels.map(()=>Math.floor(Math.random()*2200)+200);
    if (window.AppState && window.AppState.salesChart) {
      const ch = window.AppState.salesChart; ch.data.labels = labels; ch.data.datasets[0].data = dataPoints; if (typeof ch.update === 'function') ch.update('none'); return ch;
    }
    const ctx = el.getContext('2d');
    const cfg = { type:'line', data:{ labels, datasets:[{ label:'Vendas (R$)', data:dataPoints, borderColor:'#5B8BF7', backgroundColor:'rgba(91,139,247,0.08)', pointBackgroundColor:'#5B8BF7', pointRadius:3, tension:0, fill:true, borderWidth:2 }]}, options:{ responsive:true, maintainAspectRatio:false, animation:false, plugins:{ legend:{ display:false } }, scales:{ x:{ grid:{ display:false } }, y:{ grid:{ display:false } } } } };
    try { const chart = new Chart(ctx,cfg); if (window.AppState) window.AppState.salesChart = chart; return chart; } catch(e){ console.error(e); return null; }
  }

  function createOrUpdateCategoryChart() {
    const el = document.getElementById('categoryChart'); if (!el) return;
    const cat = computeCategoriesData();
    if (window.AppState && window.AppState.categoryChart) {
      const ch = window.AppState.categoryChart; ch.data.labels = cat.labels; ch.data.datasets[0].data = cat.data; if (typeof ch.update === 'function') ch.update('none'); return ch;
    }
    const ctx = el.getContext('2d');
    const cfg = { type:'doughnut', data:{ labels:cat.labels, datasets:[{ data:cat.data, backgroundColor:['#3B82F6','#7C3AED','#06B6D4','#F43F5E','#60A5FA'], hoverOffset:6 }]}, options:{ responsive:true, maintainAspectRatio:false, animation:false, plugins:{ legend:{ position:'bottom' } } } };
    try { const chart = new Chart(ctx,cfg); if (window.AppState) window.AppState.categoryChart = chart; return chart; } catch(e){ console.error(e); return null; }
  }

  function initChartsSafe(days=30){ try { createOrUpdateSalesChart(days); createOrUpdateCategoryChart(); console.info('admin-charts-restore: charts prontos'); } catch(e){ console.error(e); } }

  function updateStatsFromAppState(){
    try {
      if (!window.AppState) return;
      const orders = window.AppState.orders || []; const products = window.AppState.products || []; const customers = window.AppState.customers || [];

      const totalRevenue = orders.reduce((s,o)=>s+(Number(o.total)||0),0);
      const elRevenue = document.getElementById('total-revenue'); if (elRevenue) elRevenue.textContent = `R$ ${totalRevenue.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}`;

      const todayKey = new Date().toISOString().slice(0,10);
      const ordersToday = orders.filter(o=>o.date && o.date.slice(0,10)===todayKey).length;
      const elOrders = document.getElementById('total-orders'); if (elOrders) elOrders.textContent = String(ordersToday);

      const elProducts = document.getElementById('total-products'); if (elProducts) elProducts.textContent = String(products.length||0);
      const elCustomers = document.getElementById('total-customers'); if (elCustomers) elCustomers.textContent = String(customers.length||0);

      const bc = document.getElementById('product-count'); if (bc) bc.textContent = String(products.length||0);
      const oc = document.getElementById('order-count'); if (oc) oc.textContent = String(orders.length||0);
      const cc = document.getElementById('customer-count'); if (cc) cc.textContent = String(customers.length||0);

      if (typeof loadRecentOrders === 'function') loadRecentOrders();
      if (typeof loadTopProducts === 'function') loadTopProducts();
    } catch(e){ console.warn(e); }
  }

  async function fetchAndRenderData({ forceLocal=false } = {}) {
    let data = null;
    if (!forceLocal) data = await fetchApiData();
    if (!data) data = loadLocalData();
    normalizeAndSetAppState(data);
    updateStatsFromAppState();
    initChartsSafe(30);
    return data;
  }

  async function fetchApiData() {
    const token = API_CONFIG.getToken && API_CONFIG.getToken();
    const commonOpts = { method:'GET', headers:{ 'Accept':'application/json' }, credentials: API_CONFIG.useCredentials ? 'include' : 'same-origin' };
    if (token && !API_CONFIG.useCredentials) commonOpts.headers[API_CONFIG.authHeaderName] = `Bearer ${token}`;
    try {
      const [ro, rp, rc] = await Promise.all([
        fetchWithTimeout(API_CONFIG.endpoints.orders, commonOpts, API_CONFIG.fetchTimeoutMs),
        fetchWithTimeout(API_CONFIG.endpoints.products, commonOpts, API_CONFIG.fetchTimeoutMs),
        fetchWithTimeout(API_CONFIG.endpoints.customers, commonOpts, API_CONFIG.fetchTimeoutMs)
      ]);
      if (!ro.ok || !rp.ok || !rc.ok) throw new Error('Alguma resposta não OK');
      const [orders, products, customers] = await Promise.all([ro.json().catch(()=>[]), rp.json().catch(()=>[]), rc.json().catch(()=>[])]);
      return { orders: orders || [], products: products || [], customers: customers || [] };
    } catch (err) {
      console.warn('admin-charts-restore: erro API, fallback localStorage', err.message);
      return null;
    }
  }

  window.fetchAndRenderData = fetchAndRenderData;
  window.updateChart = function(days){ days = Number(days) || 30; initChartsSafe(days); };

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(()=>fetchAndRenderData(), 200);
  });
})();