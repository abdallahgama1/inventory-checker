// controllers/auth.controller.js
import * as UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs"; // For password hashing
import jwt from "jsonwebtoken"; // For generating tokens (if stateless authentication is desired)

// --- Configuration for JWT (move to a config file in production) ---
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Use a strong, random key from environment variables
const JWT_EXPIRES_IN = "24h"; // Token expiration time

// --- User Registration (Signup) ---
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "All fields are required." });
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password too short." });
        }

        const existingUser = await UserModel.getUserByEmail({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists." });
        }

        const userId = await UserModel.createUser({ name, email, password });

        const token = jwt.sign({ id: userId, email }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });

        res.status(201).json({
            message: "User registered successfully",
            userId,
        });
    } catch (error) {
        console.error("Error in register:", error.message);
        if (
            error.message.includes("SQLITE_CONSTRAINT") &&
            error.message.includes("users.email")
        ) {
            return res.status(409).json({ message: "User already exists." });
        }
        res.status(500).json({ message: "Registration failed." });
    }
};

// --- User Login ---
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required." });
        }

        const user = await UserModel.getUserByEmail({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24,
        });

        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            message: "Login successful",
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error("Error in login:", error.message);
        res.status(500).json({ message: "Login failed." });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token"); // Make sure the name matches the cookie you set
    res.status(200).json({
        message: "Logged out successfully. Token cookie cleared.",
    });
};
