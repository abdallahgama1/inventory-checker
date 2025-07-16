import {
    updateUserPartial,
    getUserById,
    createUser,
    getAllUsers,
    deleteUserById,
    getUserByEmail,
} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "../models/userModel.js";
import bcrypt from "bcrypt";

export const createUserController = (req, res) => {
    const { name, email, password } = req.body;

    const { valid, error } = validateNewUser({ name, email, password });
    if (!valid) {
        return res.status(400).json({ error });
    }

    if (getUserByEmail(email)) {
        return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const userId = createUser(name, email, hashedPassword);
    return res
        .status(201)
        .json({ message: "User created successfully", userId });
};

export const updateUserController = (req, res) => {
    const userId = req.params.id;

    const { valid, error, updates } = validateUserUpdate(req.body);
    if (!valid) {
        return res.status(400).json({ error });
    }

    const updated = updateUserPartial(userId, updates);
    if (updated) {
        return res.json({ message: "User updated successfully" });
    } else {
        return res
            .status(404)
            .json({ error: "User not found or no changes made" });
    }
};
