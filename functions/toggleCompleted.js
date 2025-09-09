const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;
let conn = null;
const connectDB = async()=>{ if(!conn) conn=await mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true}); };

const Order = mongoose.model("Order", new mongoose.Schema({
  user:String, product:String, quantity:Number, date:Date, completed:Boolean
}));

exports.handler = async(event)=>{
  try{
    await connectDB();
    const { orderId, completed } = JSON.parse(event.body);
    const order = await Order.findById(orderId);
    if(!order) return { statusCode:404, body:"Nie znaleziono zamówienia" };
    order.completed = completed;
    await order.save();
    return { statusCode:200, body:"Status zmieniony" };
  }catch(e){
    return { statusCode:500, body:"Błąd serwera" };
  }
};
