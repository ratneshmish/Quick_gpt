import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
const connectDb=async()=>{
    try{
       mongoose.connection.on('connected',()=>console.log('Database Connected'))
       await mongoose.connect(`${process.env.MONGO_DB_URI}/quickgpt`)
    }catch(err){
        console.log(err.message);
    }

}
export default connectDb;