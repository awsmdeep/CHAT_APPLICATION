import mongoose from "mongoose";

export const dbConnections=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"MERN_STACK_CHAT_APPLICATION",
    }).then(()=>{
        console.log("Connected to database");
    }).catch((err)=>{
        console.log(`Error connecting to server: ${err.message || err}` );
    })
}