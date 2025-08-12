// config/db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite"; // Assuming you're using the 'sqlite' package

const dbPromise = open({
    filename: "./inventory.sqlite", // e.g., './inventory.sqlite'
    driver: sqlite3.Database,
});

export default dbPromise;
