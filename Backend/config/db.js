import Database from "better-sqlite3";

// Open (or create) a SQLite database file
const db = new Database("my-database.db", {
    verbose: console.log, // Optional: log all SQL commands
});

export default db;
