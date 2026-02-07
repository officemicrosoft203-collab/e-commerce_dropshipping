const db = require('../models/db'); // assume que db.js exporta um objeto db com .all

function queryAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * GET /api/orders
 * Retorna lista de pedidos com estrutura:
 * { id, date (ISO), total, items: [{ name, quantity, price, category }], customer: { id, name, email } }
 *
 * Observação: se o schema do seu banco tiver nomes diferentes de tabelas/colunas,
 * cole aqui a saída do `sqlite3 database.sqlite ".schema"` e eu ajusto as queries.
 */
async function getOrders(req, res) {
  try {
    // 1) Pegar pedidos (best-effort)
    let orders = [];
    try {
      orders = await queryAll(`SELECT id, date, total, customer_id FROM orders ORDER BY date DESC LIMIT 500`);
    } catch (e) {
      // fallback: tabela pode ter outro nome
      try {
        orders = await queryAll(`SELECT id, date, total, customer_id FROM "order" ORDER BY date DESC LIMIT 500`);
      } catch (err) {
        orders = [];
      }
    }

    // 2) Para cada pedido, buscar items e customer (best-effort)
    const results = [];
    for (const o of orders) {
      const orderId = o.id;
      // items
      let items = [];
      try {
        items = await queryAll(
          `SELECT oi.product_id, oi.product_name as name, oi.quantity, oi.price
           FROM order_items oi WHERE oi.order_id = ?`,
          [orderId]
        );
      } catch (e) {
        try {
          items = await queryAll(
            `SELECT product_id, name, quantity, price FROM items WHERE order_id = ?`,
            [orderId]
          );
        } catch (err) {
          items = [];
        }
      }

      // enriquecer itens com categoria via products (opcional)
      for (let it of items) {
        try {
          if (it.product_id) {
            const p = await queryAll(`SELECT category FROM products WHERE id = ?`, [it.product_id]);
            it.category = (p && p[0] && p[0].category) ? p[0].category : (it.category || 'Outros');
          } else {
            it.category = it.category || 'Outros';
          }
        } catch (e) {
          it.category = it.category || 'Outros';
        }
      }

      // customer
      let customer = null;
      const custId = o.customer_id || o.customerId || null;
      if (custId) {
        try {
          const rows = await queryAll(`SELECT id, name, email FROM customers WHERE id = ? LIMIT 1`, [custId]);
          if (rows && rows[0]) {
            customer = rows[0];
          } else {
            const ru = await queryAll(`SELECT id, name, email FROM users WHERE id = ? LIMIT 1`, [custId]);
            if (ru && ru[0]) customer = ru[0];
          }
        } catch (e) {
          customer = null;
        }
      }

      results.push({
        id: orderId,
        date: (o.date ? new Date(o.date).toISOString() : null),
        total: Number(o.total || 0),
        items: items.map(it => ({
          name: it.name || it.product_name || 'Produto',
          quantity: Number(it.quantity || it.qty || 1),
          price: Number(it.price || it.unit_price || 0),
          category: it.category || 'Outros'
        })),
        customer: customer || {}
      });
    }

    return res.json(results);
  } catch (err) {
    console.error('orderController.getOrders erro:', err);
    return res.status(500).json({ error: 'Erro ao obter pedidos', details: String(err.message || err) });
  }
}

module.exports = {
  getOrders
};