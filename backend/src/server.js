const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Banco de dados
const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

// ==================== CRIAR TABELAS SIMPLES ====================
console.log('📦 Criando banco de dados...');

// Tabela products SIMPLIFICADA
db.run(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        image_url TEXT
    )
`, (err) => {
    if (err) console.error('❌ Erro products:', err.message);
    else console.log('✅ Tabela products OK');
});

// Tabela users
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`, (err) => {
    if (err) console.error('❌ Erro users:', err.message);
    else {
        console.log('✅ Tabela users OK');
        // Admin padrão
        db.run("INSERT OR IGNORE INTO users (username, password) VALUES ('admin', 'admin123')", (err) => {
            if (err) console.error('❌ Erro admin:', err.message);
            else console.log('✅ Admin: admin / admin123');
        });
    }
});

// ==================== ROTAS SIMPLES ====================

// Teste
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'API ONLINE!' });
});

// Listar produtos
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, products) => {
        if (err) {
            console.error('❌ Erro produtos:', err.message);
            res.json({ success: true, products: [] }); // Retorna vazio se erro
        } else {
            res.json({ success: true, products: products || [] });
        }
    });
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === 'admin123') {
        res.json({ 
            success: true, 
            token: 'admin-token',
            user: { username: 'admin' }
        });
    } else {
        res.status(401).json({ success: false, error: 'Credenciais inválidas' });
    }
});

// Adicionar produto
app.post('/api/products', (req, res) => {
    const { name, price, description } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ success: false, error: 'Nome e preço obrigatórios' });
    }
    
    db.run(
        "INSERT INTO products (name, price, description) VALUES (?, ?, ?)",
        [name, parseFloat(price), description || ''],
        function(err) {
            if (err) {
                console.error('❌ Erro criar produto:', err.message);
                res.status(500).json({ success: false, error: 'Erro no servidor' });
            } else {
                res.json({ success: true, productId: this.lastID });
            }
        }
    );
});

// Adicionar 5 produtos DEMO automaticamente
setTimeout(() => {
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (!err && row && row.count === 0) {
            console.log('➕ Adicionando produtos demo...');
            
            const demos = [
                ['Mouse Gamer RGB', 89.90, 'Mouse com iluminação RGB'],
                ['Teclado Mecânico', 199.90, 'Teclado com switches azuis'],
                ['Monitor 24" Full HD', 899.90, 'Monitor 144Hz 1ms'],
                ['Headset Gamer 7.1', 249.90, 'Headset surround virtual'],
                ['Cadeira Gamer', 1299.90, 'Cadeira ergonômica']
            ];
            
            demos.forEach(product => {
                db.run(
                    "INSERT INTO products (name, price, description) VALUES (?, ?, ?)",
                    product
                );
            });
            console.log('✅ 5 produtos demo adicionados!');
        }
    });
}, 1000);

// ==================== SERVIR FRONTEND ====================

// Servir frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// Rotas para páginas
app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/admin/login.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// ==================== INICIAR ====================

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 BACKEND RODANDO!');
    console.log('='.repeat(50));
    console.log(`📍 Porta: ${PORT}`);
    console.log(`🛒 Loja: http://localhost:${PORT}`);
    console.log(`👨‍💼 Admin: http://localhost:${PORT}/admin/login.html`);
    console.log(`📊 API: http://localhost:${PORT}/api/products`);
    console.log('='.repeat(50));
});