import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());

app.use("/",postRoutes);
app.use("/",userRoutes);
app.use(express.static("uploads"));


const start=async()=>{
    const connectDB=await mongoose.connect("mongodb+srv://LINKEDLNCLONE:SOFTWAREENGINEER%401234@linkedlnclone.t7fmv3k.mongodb.net/?retryWrites=true&w=majority&appName=LINKEDLNCLONE").then(() => {
    console.log("✅ Connected to MongoDB");
}).catch((err) => {
    console.log("❌ MongoDB connection error:", err.message);
});;
    app.listen(8080,()=>{
        console.log("Server is running on port 8080");
    })
}

start();

