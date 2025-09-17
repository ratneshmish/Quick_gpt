import express from "express";
import { createChat, deleteChats, getchats } from "../controllers/chatcontroller.js";
import { protect } from "../middlewares/auth.js";


const chatRouter=express.Router();
chatRouter.post('/create',protect,createChat)
chatRouter.get('/receive',protect,getchats)
chatRouter.delete('/remove',protect,deleteChats);
export default chatRouter;