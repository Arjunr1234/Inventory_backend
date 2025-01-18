import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user', 
            required: true
          },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'customer', 
            required: true
          },
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', 
            required: true
          },
          productName: {
            type: String,
            required: true
          },
          quantity: {
            type: Number,
            required: true,
            min: 1
          },
          price: {
            type: Number,
            required: true,
            min: 0
          },
          subtotal: {
            type: Number,
            required: true
          },
          saleDate: {
            type: Date,
            required:true
          },
          paymentType: {
            type: String,
            enum: ['Cash', 'Card', 'UPI', 'Other'], 
            required: true
          }
          
    },
    {timestamps:true}
)

const SaleModel = mongoose.model("Sale", saleSchema);

export default SaleModel