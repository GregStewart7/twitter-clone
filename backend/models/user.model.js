// User model schema definition
import mongoose from "mongoose";

// Define user schema with required and optional fields
const userSchema = new mongoose.Schema({
    // Required user information
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // Social connections
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
    // Profile customization
    profileImg: {
        type: String,
        default: "",
    },
    coverImg: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    Link: {
        type: String,
        default: "",
    }
}, {timestamps: true});

// Create and export User model
const User = mongoose.model("User", userSchema);

export default User;
