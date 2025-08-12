// middlewares/protect.routes.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getUserById } from "../models/user.model.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }
    try {
        // jwt.verify takes the token, the secret, and a callback/returns a decoded payload
        const decoded = jwt.verify(token, JWT_SECRET);

        // check if user exists
        const user = await getUserById({ id: decoded.id });
        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }
        req.user = decoded;
        // 4. Call next() to pass control to the next middleware or route handler
        next();
    } catch (error) {
        // Handle different JWT errors
        if (error.name === "TokenExpiredError") {
            return res
                .status(401)
                .json({ message: "Authorization token expired." });
        }
        if (error.name === "JsonWebTokenError") {
            return res
                .status(403)
                .json({ message: "Invalid authorization token." });
        }
        console.error("Error verifying token:", error.message);
        return res
            .status(500)
            .json({ message: "Failed to authenticate token." });
    }
};

export default verifyToken;
