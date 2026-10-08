import mongoose from 'mongoose';
export function makeNumber(prefix){return `${prefix}-${Date.now()}-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`;}
export function isId(v){return mongoose.isValidObjectId(v);}
