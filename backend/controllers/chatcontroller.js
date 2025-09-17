 //api controller for creating a new chat 
import Chat from "../models/chat.js";
 export const createChat=async(req,res)=>{
    try{
    const userId=req.user._id;
    const chatData={
        userId,
        messages:[],
        name:"New Chat",
        userName:req.user.name
    }
    await Chat.create(chatData);
    res.json({success:true,message:"Chat Created"})
    }catch(err){
        res.json({success:false,error:err.message});
    }
 }

 //api controller for getting all chat

 export const getchats=async(req,res)=>{
    try{
const userId=req.user._id;
const chats=await Chat.find({userId}).sort({updatedAt:-1})
res.json({success:true,chats});
    }catch(err){
        res.json({success:false,error:err.message});
    }
 }

 //api controller for deleting chat
 export const deleteChats=async(req,res)=>{
    try{
  const userId=req.user._id;
  const {chatId}=req.body;
  await Chat.deleteOne({_id:chatId,userId})
  res.json({success:true,message:"Chats Deleted"});
    }catch(err){
        res.json({success:false,error:err.message})
    }
 }