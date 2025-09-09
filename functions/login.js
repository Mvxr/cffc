const mongoose = require("mongoose");

let conn = null;

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String, // plain-text na początek
    role: String,
    flag: String,
  },
  { collection: "users" }
);

let User;

exports.handler = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);

    if (!conn) {
      conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "VibeWebShop", // 👈 ważne!
      });
      User = mongoose.model("User", userSchema);
      console.log("✅ Połączono z MongoDB");
    }

    console.log("🔍 Szukam użytkownika:", username);

    const user = await User.findOne({ username });
    console.log("📦 Znaleziony użytkownik:", user);

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Nie ma takiego użytkownika" }),
      };
    }

    // plain text check
    if (password !== user.password) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Błędne hasło" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Zalogowano pomyślnie",
        role: user.role,
        flag: user.flag,
      }),
    };
  } catch (err) {
    console.error("❌ Błąd logowania:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Błąd serwera" }),
    };
  }
};
