const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
// userRoutes existe no seu projeto: vamos registrar também
let userRoutes = null;
try {
  userRoutes = require("./routes/userRoutes");
} catch (e) {
  console.warn('userRoutes não encontrado ou não exportado corretamente. /api/users não será registrado.');
}

// orderRoutes (novo)
let orderRoutes = null;
try {
  orderRoutes = require('./routes/orderRoutes');
} catch (e) {
  console.warn('orderRoutes não encontrado (ainda).');
}

const app = express();

// 🔥 CORS COMPLETO
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 SERVIR IMAGENS ESTÁTICAS (IMPORTANTE!)
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Log de requisições
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Body:', req.body);
    }
    next();
});

// Rotas
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// registra /api/users se o arquivo existir
if (userRoutes) {
  app.use('/api/users', userRoutes);
}

// registra /api/orders se a rota existir
if (orderRoutes) {
  app.use('/api/orders', orderRoutes);
}

// Rota raiz
app.get("/", (req, res) => {
    res.json({ 
        message: "✅ API E-commerce funcionando!",
        endpoints: {
            login: "POST /api/auth/login",
            products: "GET /api/products",
            createProduct: "POST /api/products",
            upload: "POST /api/products/upload",
            orders: "/api/orders (GET) - se implementado"
        }
    });
});

// Rota de teste de uploads
app.get("/api/uploads/test", (req, res) => {
    const uploadsPath = path.join(__dirname, '../../uploads');
    let files = [];
    try {
      files = fs.readdirSync(uploadsPath);
    } catch (e) {
      files = [];
    }
    
    res.json({
        uploadsPath: uploadsPath,
        count: files.length,
        files: files,
        urlExemplo: "http://localhost:3000/uploads/nome-da-imagem.jpg"
    });
});

module.exports = app;