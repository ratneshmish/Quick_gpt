import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";
import Chat from "../models/chat.js";

//Generate JWT
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'1d'
    })
}
//api to register user
export const registerUser=async(req,res)=>{
    const{name,email,password}=req.body;
    try{
const userexist=await User.findOne({email});
if(userexist){
    return res.json({success:false,message:"User already exists"})
}
const user=await User.create({name,email,password});
const token=generateToken(user._id);
res.json({success:true,token});
    }catch(err){
  return res.json({success:false,message:err.message})
    }
}

//api to login user 
export const loginUser=async(req,res)=>{
    try{
    const {email,password}=req.body;
    const userexist=await User.findOne({email});
    if(userexist){
        const isMatch=await bcrypt.compare(password,userexist.password);
        if(isMatch){
            const token=generateToken(userexist._id);
            return res.json({success:true,token})
        }
    }
    return res.json({success:false,message:"Invalid email or password"})
    }catch(err){

   return res.json({success:false,message:err.message})
    }
}
export const getUser=async(req,res)=>{
    try{
 const user=req.user;
 return res.json({success:true,user});
    }
    catch(err){
       return res.json({success:false,message:err.message});
    }
}

//API to get published images
export const getPublishedImages=async(req,res)=>{
    try{
  const publishedImages=await Chat.aggregate([
    {$unwind:"messages"},
    {
        $match:{
            "messages.isImage":true,
            "messages.isPublished":true,
        },
    },
    {
         $project:{
            _id:0,
            imageUrl:"$messages.content",
            userName:$userName
        }
    }
  ])
  res.json({success:true,images:publishedImages})
    }
    catch(err){
        res.json({success:true,error:err.message});
    }
}