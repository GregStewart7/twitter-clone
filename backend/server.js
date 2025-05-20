// Express server setup
import express from "express";
import dotenv from "dotenv";
import { urlencoded } from "express";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";
// Import authentication routes from a separate module
// This modular approach helps in organizing different route handlers
import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";
import userRoutes from "./routes/user.routes.js";
// Load environment variables
dotenv.config();

// Configure Cloudinary for image uploads
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON and urlencoded bodies
app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(cookieParser());

// Mount auth routes with /api/auth prefix
app.use("/api/auth", authRoutes);

// Mount user routes with /api/users prefix
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/", (req, res) => {
    // Send a response back to the client
    // This is a simple text response indicating the server is ready
    res.send("Server is ready");
});

// Start server and connect to MongoDB
app.listen(PORT, () => {
    // Log a message to the console when the server starts successfully
    console.log(`Server is running on port http://localhost:${PORT}`);
    connectMongoDB();
});
