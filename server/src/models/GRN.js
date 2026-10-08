import mongoose from 'mongoose';
const itemSchema=new mongoose.Schema({product:{type:mongoose.Schema.Types.ObjectId,ref:'Product',required:true},quantity:{type:Number,min:1,required:true}},{_id:false});
const schema=new mongoose.Schema({grnNumber:{type:String,unique:true},purchaseOrder:{type:mongoose.Schema.Types.ObjectId,ref:'PurchaseOrder',required:true},items:{type:[itemSchema],validate:v=>v.length>0},receivedDate:{type:Date,default:Date.now},receivedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},notes:String},{timestamps:true});
export default mongoose.model('GRN',schema);
