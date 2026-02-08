const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { email, password } = req.body;

  console.log("🔐 Tentativa de login:", { email });

  // Credenciais fixas para admin
  const ADMIN_EMAIL = "admin@admin.com";
  const ADMIN_PASSWORD = "123456";

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      {
        email,
        role: "admin",
        userId: 1
      },
      process.env.JWT_SECRET, // 🔥 AQUI
      { expiresIn: "24h" }
    );

    console.log("✅ Login bem-sucedido");

    return res.json({
      success: true,
      message: "Login realizado com sucesso",
      token,
      user: {
        email,
        role: "admin",
        name: "Administrador"
      }
    });
  }

  console.log("❌ Login falhou - credenciais inválidas");

  return res.status(401).json({
    success: false,
    error: "Credenciais inválidas. Use: admin@admin.com / 123456"
  });
};
