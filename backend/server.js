import express from 'express';

import cors from 'cors'
import connectDb from './config/db.js';
import userRouter from './routes/userRouter.js';
import chatRouter from './routes/chatroutes.js';
import MessageRouter from './routes/messageroute.js';
import creditRouter from './routes/creditroutes.js';
import { stripewebHooks } from './controllers/webhookscontroller.js';
const app=express();
await connectDb();
app.use(cors());

app.post('/api/stripe',express.raw({type:'application/json'}),stripewebHooks)
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("server is Live!");
})
app.use('/api/user',userRouter);
app.use('/api/chats',chatRouter);
app.use('/api/message',MessageRouter)
app.use('/api/credit',creditRouter);
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})