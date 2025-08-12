import dbPromise from "../config/db.js"; // Changed to dbPromise for consistency

// Create a new session
export const newSession = async ({ userId }) => {
    const db = await dbPromise;
    try {
        const result = await db.run(
            `INSERT INTO sessions (userId) VALUES (?)`,
            [userId]
        );

        return {
            id: result.lastID, // async version of lastInsertRowid
            userId,
        };
    } catch (error) {
        console.error("Error creating new session:", error);
        throw error;
    }
};

// Get a session by ID
export const getProductInSessionById = async ({ sessionId }) => {
    const db = await dbPromise;
    try {
        const row = await db.get(`SELECT * FROM sessions WHERE id = ?`, [
            sessionId,
        ]);
        return row;
    } catch (error) {
        console.error(`Error getting session by ID ${sessionId}:`, error);
        throw error;
    }
};

// Get all sessions
export const getAllSessions = async () => {
    const db = await dbPromise;
    try {
        const rows = await db.all(`SELECT * FROM sessions`);
        return rows;
    } catch (error) {
        console.error("Error getting all sessions:", error);
        throw error;
    }
};

export const getSessionById = async ({ sessionId }) => {
    const db = await dbPromise;
    try {
        const row = await db.get(`SELECT * FROM sessions WHERE id = ?`, [
            sessionId,
        ]);
        return row;
    } catch (error) {
        console.error(`Error getting session by ID ${sessionId}:`, error);
        throw error;
    }
};

// Delete a session by ID
export const deleteSessionById = async ({ sessionId }) => {
    const db = await dbPromise;
    try {
        const result = await db.run(`DELETE FROM sessions WHERE id = ?`, [
            sessionId,
        ]);

        return result.changes > 0; // true if a row was deleted
    } catch (error) {
        console.error(`Error deleting session by ID ${sessionId}:`, error);
        throw error;
    }
};
