// controllers/user.controller.js (after removing createUser)
import * as UserModel from "../models/user.model.js"; // Import all functions from your user model

// --- Get User by ID ---
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID format." });
        }

        const user = await UserModel.getUserById({ id });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error(
            `Error in getUserById controller (ID: ${req.params.id}):`,
            error.message
        );
        res.status(500).json({
            message: "Failed to retrieve user. Please try again later.",
        });
    }
};

// --- Get All Users ---
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getAllUsers controller:", error.message);
        res.status(500).json({
            message: "Failed to retrieve users. Please try again later.",
        });
    }
};

// --- Update User ---
export const updateUser = async (req, res) => {
    const { id } = req.user;

    if (!req.body || Object.keys(req.body).length === 0) {
        return res
            .status(400)
            .json({ message: "No fields provided to update." });
    }

    try {
        const currentUser = await UserModel.getUserById({ id });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found." });
        }
        const updatedData = {
            name: req.body.name ?? currentUser.name,
            email: req.body.email ?? currentUser.email,
            password: req.body.password ?? currentUser.password,
        };

        const updatedUser = await UserModel.updateUser({
            id: id,
            name: updatedData.name,
            email: updatedData.email,
            password: updatedData.password,
        });

        if (updatedUser) {
            return res
                .status(200)
                .json({ message: "User updated", user: updatedUser });
        } else {
            return res.status(500).json({ message: "Failed to update user." });
        }
    } catch (error) {
        console.error(`Error in updateUser controller (ID: ${id}):`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// --- Delete User ---
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID format." });
        }
        //const isAdmin = req.user.role === "admin";
        const success = await UserModel.deleteUserById({ id });

        if (!success) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(204).json({ message: "User deleted successfully." });
    } catch (error) {
        console.error(
            `Error in deleteUser controller ( ID: ${req.params.id}):`,
            error.message
        );
        res.status(500).json({
            message: "Failed to delete user. Please try again later.",
        });
    }
};
