import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"user"
        },
        name:{
            type:String,
            required:true,
        },
        address:{
            type:String,
            required:true,
        },
        phone:{
            type:String,
            required:true
        }
    },
    {timestamps:true}
);

const customerModel = mongoose.model("customer", customerSchema);

export default customerModel