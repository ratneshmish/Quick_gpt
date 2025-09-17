import express from "express";
import { imageMessageController, textMessageController } from "../controllers/messagecontroller.js";
import { protect } from "../middlewares/auth.js";

const MessageRouter=express.Router();
MessageRouter.post('/text',protect,textMessageController);
MessageRouter.post('/image',protect,imageMessageController);
export default MessageRouter;