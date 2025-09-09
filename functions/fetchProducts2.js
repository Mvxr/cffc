const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async () => {
  try {
    if (!client.topology?.isConnected()) {
      await client.connect();
    }
    const db = client.db("VibeWebShop");
    const products = await db.collection("products2").find({}).toArray();

    console.log("📦 [products2] Znalezione produkty:", products);

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (err) {
    console.error("❌ Błąd fetchProducts2:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
