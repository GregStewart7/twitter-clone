// Express router for handling authentication endpoints
import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

// Create router instance for auth routes
const router = express.Router();

// Authentication endpoints
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Export router for use in server.js
export default router;
