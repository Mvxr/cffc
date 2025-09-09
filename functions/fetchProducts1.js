const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async () => {
  try {
    if (!client.topology?.isConnected()) {
      await client.connect();
    }
    const db = client.db("VibeWebShop");
    const products = await db.collection("products1").find({}).toArray();

    console.log("📦 [products1] Znalezione produkty:", products);

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (err) {
    console.error("❌ Błąd fetchProducts1:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
