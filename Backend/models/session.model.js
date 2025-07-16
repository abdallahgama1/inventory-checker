import db from "../config/db.js";
import { validateId } from "../utils/user.validator.js";

export const newSession = (userId) => {
    const { valid, id } = validateId(userId);
    if (!valid) throw new Error("Invalid userId");

    const stmt = db.prepare(`INSERT INTO sessions ( userId ) VALUES (?)`);
    const result = stmt.run(id);
    return result.lastInsertRowid;
};

export const viewSession = (sessionId) => {
    const { valid, id } = validateId(sessionId);
    if (!valid) throw new Error("Invalid sessionId");

    const stmt = db.prepare(`SELECT * FROM sessions WHERE id = ?`);
    return stmt.get(id);
};

export const getAllSessions = () => {
    const stmt = db.prepare(`SELECT * FROM sessions`);
    return stmt.all();
};

export const deleteSession = (sessionId) => {
    const { valid, id } = validateId(sessionId);
    if (!valid) throw new Error("Invalid sessionId");

    const stmt = db.prepare(`DELETE FROM sessions WHERE id = ?`);
    return stmt.run(id);
};
