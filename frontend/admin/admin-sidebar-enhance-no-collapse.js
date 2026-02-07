// admin-sidebar-enhance-no-collapse.js
// Versão final: garante que "Ver Loja" exista e fique posicionado logo acima de "Sair".
// Resiliente: re-insere / reposiciona se outros scripts reescreverem a sidebar.

(function () {
  if (window.__admin_sidebar_no_collapse_loaded_final) {
    console.info('admin-sidebar-no-collapse: já carregado (final)');
    return;
  }
  window.__admin_sidebar_no_collapse_loaded_final = true;

  const ITEM_ID = 'ver-loja-item';
  const ITEM_HREF = '../index.html'; // ajuste se necessário
  const RETRY_MS = 200;
  const MAX_TRIES = 100;

  const $ = (sel, root = document) => (root || document).querySelector(sel);
  const $all = (sel, root = document) => Array.from((root || document).querySelectorAll(sel));
  const log = (...args) => console.debug('[sidebar-enhance]', ...args);

  // create the li element (idempotent creation)
  function makeVerLoja() {
    const li = document.createElement('li');
    li.id = ITEM_ID;
    li.className = 'nav-item';
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href = ITEM_HREF;
    a.innerHTML = '<i class="bi bi-shop"></i><span class="sidebar-label">Ver Loja</span>';
    // abrir em nova aba opcional: a.target = '_blank';
    li.appendChild(a);
    return li;
  }

  // find sidebar nav container
  function findNavContainer() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return null;
    const nav = sidebar.querySelector('.sidebar-nav');
    if (!nav) return null;
    return nav;
  }

  // find the "Sair" nav item (we search by text and by .text-danger link)
  function findSairItem(navContainer) {
    // procurar por link com texto "sair" (mais robusto)
    const links = $all('.nav-link', navContainer);
    for (const a of links) {
      const txt = (a.textContent || '').trim().toLowerCase();
      if (txt === 'sair' || txt.endsWith('sair') || txt.includes('sair')) {
        const li = a.closest('li.nav-item');
        if (li) return li;
      }
    }
    // fallback: procurar li com link .text-danger
    const danger = navContainer.querySelector('.nav-link.text-danger');
    if (danger) return danger.closest('li.nav-item');
    return null;
  }

  // ensures item exists and placed immediately before "Sair"; returns true if ok
  function ensureVerLojaPlaced() {
    const nav = findNavContainer();
    if (!nav) return false;

    // if item already present somewhere, keep reference
    let existing = document.getElementById(ITEM_ID);
    if (existing) {
      // If already correctly positioned (immediately before Sair), done
      const sair = findSairItem(nav);
      if (sair && sair.previousElementSibling === existing) {
        return true;
      }
    } else {
      // try to find any link with text 'ver loja' and tag it
      const candidate = $all('.nav-link', nav).find(a => (a.textContent || '').toLowerCase().includes('ver loja') || (a.getAttribute('href')||'').toLowerCase().includes('index.html'));
      if (candidate) {
        const li = candidate.closest('li.nav-item');
        if (li) {
          li.id = ITEM_ID;
          existing = li;
        }
      }
    }

    // create if still not found
    if (!existing) existing = makeVerLoja();

    // find target position (before Sair). If not found, append to end of nav list.
    const sair = findSairItem(nav);
    if (sair && sair.parentElement) {
      // ensure we insert into the same UL where Sair lives (some grouping wraps ULs)
      const sairUL = sair.closest('ul.nav');
      if (sairUL) {
        // if existing is already in DOM but in different UL, remove first
        if (existing.parentElement && existing.parentElement !== sairUL) existing.parentElement.removeChild(existing);
        // insert before sair
        sairUL.insertBefore(existing, sair);
        return true;
      }
    }

    // fallback: append to the last ul.nav inside nav container
    const uls = nav.querySelectorAll('ul.nav');
    if (uls.length) {
      const lastUL = uls[uls.length - 1];
      if (existing.parentElement && existing.parentElement !== lastUL) existing.parentElement.removeChild(existing);
      lastUL.appendChild(existing);
      return true;
    }

    // If nav has no UL (unlikely), append directly to nav
    if (!existing.parentElement) nav.appendChild(existing);
    return true;
  }

  // Attempt with retries (useful if other scripts replace DOM shortly after load)
  function ensureWithRetries() {
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      const ok = ensureVerLojaPlaced();
      if (ok) {
        log('Ver Loja garantido (tentativa)', tries);
        clearInterval(t);
      } else if (tries >= MAX_TRIES) {
        log('Ver Loja: max retries atingido');
        clearInterval(t);
      }
    }, RETRY_MS);
  }

  // Observe mutations and re-ensure placement
  function observeSidebar() {
    const bodyMo = new MutationObserver(mutations => {
      // small debounce
      if (window.__verloja_debounce) clearTimeout(window.__verloja_debounce);
      window.__verloja_debounce = setTimeout(() => {
        try { ensureVerLojaPlaced(); } catch (e) {}
      }, 120);
    });
    bodyMo.observe(document.body, { childList: true, subtree: true });

    // also observe nav container specifically if exists
    const nav = findNavContainer();
    if (nav) {
      const mo = new MutationObserver(muts => {
        if (window.__verloja_nav_debounce) clearTimeout(window.__verloja_nav_debounce);
        window.__verloja_nav_debounce = setTimeout(() => {
          try { ensureVerLojaPlaced(); } catch (e) {}
        }, 100);
      });
      mo.observe(nav, { childList: true, subtree: true });
    }
  }

  // style minimal (idempotent)
  function injectStyles() {
    if (document.getElementById('admin-sidebar-no-collapse-styles-final')) return;
    const s = document.createElement('style');
    s.id = 'admin-sidebar-no-collapse-styles-final';
    s.textContent = `
      #${ITEM_ID} .nav-link { display:flex; align-items:center; gap:.75rem; padding:.65rem 1rem; margin:.25rem .5rem; border-radius:.5rem; }
      #${ITEM_ID} .nav-link i { min-width:24px; text-align:center }
    `;
    document.head.appendChild(s);
  }

  // init
  function init() {
    try {
      injectStyles();
      ensureWithRetries();
      observeSidebar();
      // final assurance: one immediate call
      ensureVerLojaPlaced();
      log('admin-sidebar final initialized');
    } catch (e) {
      console.error('admin-sidebar final init error', e);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();