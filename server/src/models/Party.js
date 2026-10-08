import mongoose from 'mongoose';
const partySchema=new mongoose.Schema({name:{type:String,required:true,trim:true},email:{type:String,trim:true,lowercase:true},phone:{type:String,trim:true},address:{type:String,trim:true},active:{type:Boolean,default:true}},{timestamps:true});
export const Customer=mongoose.model('Customer',partySchema,'customers');
export const Supplier=mongoose.model('Supplier',partySchema,'suppliers');
