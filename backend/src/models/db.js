db.run(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dropi_id TEXT UNIQUE,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        cost REAL,
        description TEXT,
        stock INTEGER DEFAULT 0,
        image_url TEXT,
        sku TEXT,
        category TEXT,
        supplier TEXT,
        supplier_id TEXT,
        dropi_imported INTEGER DEFAULT 0,
        images TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) {
        console.error("❌ Erro ao criar tabela:", err.message);
    } else {
        console.log("✅ Tabela 'products' pronta com campos Dropi");
    }
});