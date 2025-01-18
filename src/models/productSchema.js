import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      ref: "user", 
    },
    product: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price:{
        type:Number,
        required:true
    }
  },
  {
    timestamps: true, 
  }
);


const productModel = mongoose.model("Product", productSchema);


export default productModel;
