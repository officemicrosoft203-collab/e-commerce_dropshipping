const db = require("./models/db");
const bcrypt = require("bcryptjs");

const email = "admin@admin.com";
const password = "123456";

const hashedPassword = bcrypt.hashSync(password, 10);

db.run(
  "INSERT INTO admins (email, password) VALUES (?, ?)",
  [email, hashedPassword],
  function (err) {
    if (err) {
      console.error("Erro ao criar admin:", err.message);
    } else {
      console.log("✅ Admin criado com sucesso!");
    }
  }
);
