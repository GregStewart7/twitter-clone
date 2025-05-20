// Express server setup
import express from "express";
import dotenv from "dotenv";
import { urlencoded } from "express";
import cookieParser from "cookie-parser";
// Import authentication routes from a separate module
// This modular approach helps in organizing different route handlers
import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

console.log(process.env.MONGO_URI); // Log DB URI for debugging

// Middleware to parse JSON and urlencoded bodies
app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(cookieParser());

// Mount auth routes with /api/auth prefix
app.use("/api/auth", authRoutes);

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
