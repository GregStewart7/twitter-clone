// MongoDB connection setup
import mongoose from "mongoose";

// Connect to MongoDB using URI from environment variables
const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default connectMongoDB;
