const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const uri = process.env.MONGO_URI; // <- pamiętaj, żeby mieć na końcu /cffc
let conn = null;

const connectDB = async () => {
  if (!conn) {
    conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Połączono z MongoDB");
  }
};

// Schemat użytkownika (wymuszenie kolekcji users)
const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    role: String
  },
  { collection: "users" }
);

const User = mongoose.model("User", userSchema);

exports.handler = async (event) => {
  try {
    await connectDB();

    const { username, password } = JSON.parse(event.body);

    if (!username || !password) {
      return { statusCode: 400, body: "⚠️ Brak loginu lub hasła" };
    }

    console.log("🔍 Szukam użytkownika:", username);

    const user = await User.findOne({ username });
    console.log("📦 Znaleziony użytkownik:", user);

    if (!user) {
      return { statusCode: 401, body: "❌ Niepoprawny login lub hasło" };
    }

    // porównanie hasła
    const match = await bcrypt.compare(password, user.password);
    console.log("🔑 Czy hasło pasuje?", match);

    if (!match) {
      return { statusCode: 401, body: "❌ Niepoprawny login lub hasło" };
    }

    // sukces
    return {
      statusCode: 200,
      body: JSON.stringify({
        username: user.username,
        role: user.role
      })
    };

  } catch (err) {
    console.error("💥 Błąd w login.js:", err);
    return { statusCode: 500, body: "Błąd serwera" };
  }
};
