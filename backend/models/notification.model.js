import mongoose from "mongoose";

// Notification schema for user actions (follow, like)
const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId, // User who triggered the notification
        ref: 'User',
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId, // User receiving the notification
        ref: 'User',
        required: true,
    },
    type: {
        type: String, // Notification type
        required: true,
        enum: ['follow', 'like']
    },
    read: {
        type: Boolean,  // Read/unread status
        default: false,
    }
}, {timestamps: true});

// Notification model
const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
