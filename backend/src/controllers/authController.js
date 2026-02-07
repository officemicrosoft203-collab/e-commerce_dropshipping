const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { email, password } = req.body;
  
  console.log("🔐 Tentativa de login:", { email });
  
  // Credenciais fixas para admin
  const ADMIN_EMAIL = "admin@admin.com";
  const ADMIN_PASSWORD = "123456";
  
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Gerar token JWT
    const token = jwt.sign(
      { 
        email: email, 
        role: "admin",
        userId: 1 
      },
      "MINHA_CHAVE_SECRETA_DO_JWT_123456", // Chave secreta
      { expiresIn: "24h" } // Expira em 24 horas
    );
    
    console.log("✅ Login bem-sucedido");
    
    return res.json({
      success: true,
      message: "Login realizado com sucesso",
      token: token,
      user: { 
        email: email, 
        role: "admin",
        name: "Administrador" 
      }
    });
  }
  
  console.log("❌ Login falhou - credenciais inválidas");
  
  res.status(401).json({
    success: false,
    error: "Credenciais inválidas. Use: admin@admin.com / 123456"
  });
};