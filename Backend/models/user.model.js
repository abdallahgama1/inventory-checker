// models/user.model.js
import db from "../config/db.js";

export const createUser = (name, email, password) => {
    const stmt = db.prepare(
        `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`
    );
    const result = stmt.run(name, email, password);
    return result.lastInsertRowid;
};

export const getUserByEmail = (email) => {
    const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
    return stmt.get(email);
};

export const getUserById = (id) => {
    const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
    return stmt.get(id);
};

export const getAllUsers = () => {
    const stmt = db.prepare(`SELECT id, name, email FROM users`);
    return stmt.all();
};

export const updateUser = (id, name, email, password) => {
    const stmt = db.prepare(`
    UPDATE users
    SET name = ?, email = ?, password = ?
    WHERE id = ?
  `);
    const result = stmt.run(name, email, password, id);
    return result.changes > 0; // returns true if a row was updated
};

export const deleteUserById = (id) => {
    const stmt = db.prepare(`DELETE FROM users WHERE id = ?`);
    return stmt.run(id);
};
