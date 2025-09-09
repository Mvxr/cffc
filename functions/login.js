const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const uri = process.env.MONGO_URI;

let conn = null;

const connectDB = async () => {
  if (conn == null) {
    conn = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  }
};

const User = mongoose.model("User", new mongoose.Schema({
  username: String,
  password: String,
  role: String
}));

exports.handler = async (event) => {
  try {
    await connectDB();
    const { username, password } = JSON.parse(event.body);
    const user = await User.findOne({ username });
    if (!user) return { statusCode: 401, body: "Niepoprawny login" };

    const match = await bcrypt.compare(password, user.password);
    if (!match) return { statusCode: 401, body: "Niepoprawne hasło" };

    return { statusCode: 200, body: JSON.stringify({ username: user.username, role: user.role }) };
  } catch (e) {
    return { statusCode: 500, body: "Błąd serwera" };
  }
};
