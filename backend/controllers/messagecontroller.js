import imagekit from "../config/imagekit.js";
import Chat from "../models/chat.js";
import User from "../models/User.js";
import axios from 'axios';
import openai from "../config/openai.js";

//Text-based AI chat message Controller

export const textMessageController=async(req,res)=>{
    try{
     const userId=req.user._id;
     const {chatId,prompt}=req.body;
     const chat=await Chat.findOne({userId,_id:chatId});
     
     chat.messages.push({role:"user",content:prompt,timeStamp:Date.now(),isImage:false})
     const {choices}= await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content:prompt,
        },
    ],
});
const reply={...choices[0].message,timeStamp:Date.now(),isImage:false}
chat.messages.push(reply)
await chat.save();
await User.updateOne({_id:userId},{$inc:{credits:-1}})
res.json({success:true,reply})


    }catch(err){
        res.json({success:false,error:err.message});
    }
}

//Image Generation Message Controller 
export const imageMessageController=async(req,res)=>{
    try{
   const userId=req.user._id;
   if(req.user.credits<1){
    return res.json({success:false,message:"You don't have enough credits to use this feature"});
   }
   const {chatId,prompt,isPublished}=req.body;
   //Find chat
   const chat=await Chat.findOne({userId,_id: chatId})
    chat.messages.push({
        role:"user",
        content:prompt,
        timeStamp:Date.now(),
        isImage:false});

        //Encode the prompt
        const encodedPrompt=encodeURIComponent(prompt);

        //construct ImageKit AI generator URL
        const generatedImageUrl=`${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

        //trigger generation by fetching from Imagekit
        const aiImageResponse=await axios.get(generatedImageUrl,{responseType:"arraybuffer"})
        //convert to Base64
        const base64Image=`data:image/png;base64,${Buffer.from(aiImageResponse.data,"binary").toString('base64')}`;
        //upload imagkit to media library
        const uploadResponse=await imagekit.upload({
            file:base64Image,
            fileName:`${Date.now()}.png`,
            folder:"quickgpt"
        })
        const reply={
            role:"assistant",
            content:uploadResponse.url,
            timeStamp:Date.now(),
            isImage:true,
            isPublished
        }
      
         chat.messages.push(reply);
         await chat.save();
        await User.updateOne({_id:userId},{$inc:{credits:-2}})
          res.json({success:true,reply});
       
       
    }catch(err){
        res.json({success:false,error:err.message});
    }
}