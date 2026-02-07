function loadPage(page) {
  const content = document.getElementById("dashboard-content");

  fetch(page)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
      updateActiveNav(page);
    })
    .catch(() => {
      content.innerHTML = "<p class='text-danger'>Erro ao carregar a página.</p>";
    });
}

function updateActiveNav(page) {
  document.querySelectorAll(".sidebar .nav-link")
    .forEach(link => link.classList.remove("active"));

  const map = {
    "dashboard": "speedometer2",
    "products.html": "box-seam",
    "orders.html": "cart-check",
    "customers.html": "people",
    "analytics.html": "graph-up",
    "reports.html": "file-earmark-bar-graph"
  };

  Object.keys(map).forEach(key => {
    if (page.includes(key)) {
      document
        .querySelector(`.bi-${map[key]}`)
        ?.closest(".nav-link")
        ?.classList.add("active");
    }
  });
}
