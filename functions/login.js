const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const uri = process.env.MONGO_URI;  // Upewnij się, że masz ustawione w Netlify Environment Variables
let conn = null;

const connectDB = async () => {
  if (!conn) conn = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

// Schemat użytkownika
const User = mongoose.model("User", new mongoose.Schema({
  username: String,
  password: String,
  role: String
}));

exports.handler = async (event) => {
  try {
    await connectDB();

    const { username, password } = JSON.parse(event.body);
    if (!username || !password) return { statusCode: 400, body: "Brak loginu lub hasła" };

    const user = await User.findOne({ username });
    console.log("Znaleziony użytkownik:", user); // <- debug

    if (!user) return { statusCode: 401, body: "Niepoprawny login lub hasło" };

    // Sprawdzenie hasła
    const match = await bcrypt.compare(password, user.password);
    console.log("Czy hasło pasuje?", match); // <- debug

    if (!match) return { statusCode: 401, body: "Niepoprawny login lub hasło" };

    // Zwracamy username i role
    return { statusCode: 200, body: JSON.stringify({ username: user.username, role: user.role }) };

  } catch (e) {
    console.error("Błąd w login.js:", e);
    return { statusCode: 500, body: "Błąd serwera" };
  }
};
