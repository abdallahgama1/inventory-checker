// models/user.model.js
import dbPromise from "../config/db.js"; // dbPromise is a Promise<Database>
import bcrypt from "bcryptjs"; // For password hashing

export const createUser = async ({ name, email, password }) => {
    const db = await dbPromise;
    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.run(
            `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
            [name, email, hashedPassword]
        );
        return result.lastID;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const getUserByEmail = async ({ email }) => {
    const db = await dbPromise;
    try {
        return await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
    } catch (error) {
        console.error(`Error getting user by email ${email}:`, error);
        throw error;
    }
};

export const getUserById = async ({ id }) => {
    const db = await dbPromise;
    try {
        return await db.get(`SELECT * FROM users WHERE id = ?`, [id]);
    } catch (error) {
        console.error(`Error getting user by ID ${id}:`, error);
        throw error;
    }
};

export const getAllUsers = async () => {
    const db = await dbPromise;
    try {
        return await db.all(`SELECT id, name, email FROM users`);
    } catch (error) {
        console.error("Error getting all users:", error);
        throw error;
    }
};

export const updateUser = async ({ id, name, email, password }) => {
    const db = await dbPromise;
    try {
        const result = await db.run(
            `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`,
            [name, email, password, id]
        );
        return result.changes > 0 ? { id, name, email, password } : null; // Return updated data or null
    } catch (error) {
        console.error(`Error updating user by ID ${id}:`, error);
        throw error;
    }
};

export const deleteUserById = async ({ id }) => {
    const db = await dbPromise;
    try {
        const result = await db.run(`DELETE FROM users WHERE id = ?`, [id]);
        return result.changes > 0;
    } catch (error) {
        console.error(`Error deleting user by ID ${id}:`, error);
        throw error;
    }
};
