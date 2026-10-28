import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    from_user_id:{}
},{timestamps:true,minimize:false})