const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;
let conn = null;

const connectDB = async () => { if(conn==null) conn=await mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true}); };

const Product = mongoose.model("Product", new mongoose.Schema({
  product_name:String, price:Number, stock:Number, tab:Number
}));
const Order = mongoose.model("Order", new mongoose.Schema({
  user:String, product:String, quantity:Number, date:Date, completed:Boolean
}));

exports.handler = async(event)=>{
  try{
    await connectDB();
    const { username, productId, tab } = JSON.parse(event.body);

    const product = await Product.findOne({_id:productId, tab});
    if(!product || product.stock<=0) return { statusCode:400, body:"Produkt niedostępny" };

    product.stock -= 1;
    await product.save();

    const order = new Order({ user:username, product:product.product_name, quantity:1, date:new Date(), completed:false });
    await order.save();

    return { statusCode:200, body:"Zamówienie przyjęte" };
  }catch(e){
    return { statusCode:500, body:"Błąd serwera" };
  }
};
