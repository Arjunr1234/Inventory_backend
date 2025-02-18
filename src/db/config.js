import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    try {
        await mongoose.connect(uri);
        console.log("MongoDB is connected successfully");
    } catch (error) {
        console.error('MongoDB connection error', error);
        process.exit(1);
    }
}

export default connectDB;
