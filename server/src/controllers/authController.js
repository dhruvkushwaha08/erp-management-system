import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import {signToken} from '../utils/token.js';
export async function register(req,res){const {name,email,password,role}=req.body;if(!name||!email||!password)return res.status(400).json({message:'Name, email and password are required'});if(await User.findOne({email}))return res.status(409).json({message:'Email already registered'});const hash=await bcrypt.hash(password,12);const user=await User.create({name,email,password:hash,role:'Sales'});res.status(201).json({token:signToken(user),user:{id:user._id,name:user.name,email:user.email,role:user.role}});}
export async function login(req,res){const {email,password}=req.body;const user=await User.findOne({email}).select('+password');if(!user||!user.active||!(await bcrypt.compare(password||'',user.password)))return res.status(401).json({message:'Invalid email or password'});res.json({token:signToken(user),user:{id:user._id,name:user.name,email:user.email,role:user.role}});}
export async function me(req,res){res.json({user:{id:req.user._id,name:req.user.name,email:req.user.email,role:req.user.role}});}
