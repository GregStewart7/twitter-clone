import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary";

// Get a user's profile by username (excluding password)
export const getUserProfile = async (req, res) => {
    const {username} = req.params;
    try {
        const user = await User.findOne({username}).select("-password");
        if(!user) return res.status(404).json({error: "User not found"});
        res.status(200).json(user);  
    } catch (error) {
        res.status(500).json(error.message);
        console.log("Error in getUserProfile controller", error.message);
    }
}

// Follow or unfollow a user by ID
export const followUnfollowUser = async (req, res) => {
    try {
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        // Prevent self-follow/unfollow
        if(id === req.user._id.toString()) {
            return res.status(400).json({error: "You cannot follow/unfollow yourself"});
        }

        // Check if users exist
        if(!userToModify || !currentUser) {
            return res.status(404).json({error: "User not found"});
        }

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing) {
            // Unfollow user
            await User.findByIdAndUpdate(id, { $pull: {followers: req.user._id} });
            await User.findByIdAndUpdate(req.user._id, { $pull: {following: id} });
            res.status(200).json({message: "Unfollowed successfully"});
        } else {
            // Follow user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            // Create follow notification
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id
            });
            await newNotification.save();
            res.status(200).json({message: "Followed successfully"});
        }

    } catch (error) {
        res.status(500).json(error.message);
        console.log("Error in followUnfollowUser controller", error.message);
    }
}

// Get up to 4 suggested users not followed by current user
export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const usersFollowedByMe = await User.findById(userId).select("following");
        const users = await User.aggregate([
            { $match: { _id: {$ne:userId} } },
            { $sample: {size: 10} }
        ])
        const filteredUsers = users.filter(user => !usersFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 4);
        suggestedUsers.forEach(user => user.password = null);
        res.status(200).json(suggestedUsers);
    } catch (error) {
        res.status(500).json(error.message);
        console.log("Error in getSuggestedUsers controller", error.message);
    }
}

// Update user profile and password, handle image uploads
export const updateUser = async (req, res) => {
    const {username, fullName, email, bio, link, currentPassword, newPassword} = req.body;
    let {profileImg, coverImg} = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if(!user) return res.status(404).json({error: "User not found"});

        // Password update validation
        if((!newPassword && currentPassword) || (newPassword && !currentPassword)) {
            return res.status(400).json({error: "Current password is required"});
        }
        if(currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch) return res.status(401).json({error: "Current password is incorrect"});
            if(newPassword.length < 8) {
                return res.status(400).json({error: "New password must be at least 8 characters long"});
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Handle profile image upload
        if(profileImg) {
            if(user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            const uploadResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadResponse.secure_url;
        }

        // Handle cover image upload
        if(coverImg) {
            if(user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }
            const uploadResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadResponse.secure_url;
        }

        // Update user fields
        user.fullName = fullName || user.fullName;
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        await user.save();
        user.password = null; // Do not return password
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error.message);
        console.log("Error in updateUser controller", error.message);
    }
}
