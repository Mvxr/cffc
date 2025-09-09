const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;
let conn = null;

const connectDB = async () => {
  if (conn == null) conn = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

const Product = mongoose.model("Product", new mongoose.Schema({
  product_name: String,
  price: Number,
  stock: Number,
  tab: Number
}));

exports.handler = async (event) => {
  try {
    await connectDB();
    const tab = Number(event.queryStringParameters.tab || 1);
    const products = await Product.find({ tab });
    return { statusCode: 200, body: JSON.stringify(products) };
  } catch(e){
    return { statusCode: 500, body: "Błąd serwera" };
  }
};
