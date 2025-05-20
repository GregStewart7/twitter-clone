import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes, checks JWT and attaches user to req
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({
                message: "Unauthorized: No token provided",
            });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({
                message: "Unauthorized: Invalid token",
            });
        }

        // Find user by ID, exclude password
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({
                message: "Unauthorized: User not found",
            });
        }

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
