import mongoose from 'mongoose';
const itemSchema=new mongoose.Schema({product:{type:mongoose.Schema.Types.ObjectId,ref:'Product',required:true},title:String,sku:String,quantity:{type:Number,min:1,required:true},unitPrice:{type:Number,min:0,required:true},lineTotal:{type:Number,min:0,required:true}},{_id:false});
const schema=new mongoose.Schema({orderNumber:{type:String,unique:true},supplier:{type:mongoose.Schema.Types.ObjectId,ref:'Supplier',required:true},items:{type:[itemSchema],validate:v=>v.length>0},status:{type:String,enum:['Draft','Ordered','Partially Received','Received','Cancelled'],default:'Draft'},totalPrice:{type:Number,default:0},notes:String,createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'}},{timestamps:true});
schema.pre('validate',function(next){this.totalPrice=this.items.reduce((s,i)=>s+i.lineTotal,0);next();});
export default mongoose.model('PurchaseOrder',schema);
