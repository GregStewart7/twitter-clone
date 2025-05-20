import jwt from "jsonwebtoken";

// Generate JWT token and set it as HTTP-only cookie
const generateTokenAndSetCookie = (res, userId) => {
    // Create JWT token with user ID
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d" // Token expires in 15 days
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // milliseconds
        httpOnly: true, // prevents XSS attacks
        sameSite: "strict", // CSRF attacks
        secure: process.env.NODE_ENV !== "development", // use secure cookies in production
    });
};

export default generateTokenAndSetCookie;
