const mongoose = require("mongoose");

let conn = null;

const productSchema = new mongoose.Schema(
  {
    product_name: String,
    price: Number,
    stock: Number,
  },
  { collection: "products3" } // 👈 tu products3
);

let Product;

exports.handler = async () => {
  try {
    if (!conn) {
      conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "VibeWebShop", // 👈 ważne
      });
      Product = mongoose.model("Product1", productSchema);
      console.log("✅ Połączono z MongoDB (products1)");
    }

    const products = await Product.find();
    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (err) {
    console.error("❌ Błąd pobierania products1:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Błąd serwera" }),
    };
  }
};
