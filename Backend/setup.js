import db from "./config/db.js";

// Enable foreign key constraints (very important in SQLite)
db.pragma("foreign_keys = ON");

// Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`);

// Products table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    sellingPrice REAL NOT NULL,
    costPrice REAL NOT NULL,
    brand TEXT DEFAULT 'Unknown',
    category TEXT DEFAULT 'Generic'
  );
`);

// Sessions table
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
  );
`);

// Session Contents table
db.exec(`
  CREATE TABLE IF NOT EXISTS session_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sessionId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    sellingPrice REAL NOT NULL,
    costPrice REAL NOT NULL,
    product_name TEXT NOT NULL,
    product_sku TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Exact', 'Over Count', 'Under Count')),
    variance REAL NOT NULL,
    FOREIGN KEY (sessionId) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id)
  );
`);

// Branches table
db.exec(`
  CREATE TABLE IF NOT EXISTS branches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    location TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// Branch Products table
db.exec(`
  CREATE TABLE IF NOT EXISTS branch_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    branchId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (branchId) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
  );
`);

// Index for fast session item lookup by sessionId
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_session_items_sessionId
  ON session_items(sessionId);
`);

// Index for fast session item lookup by productId
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_session_items_productId
  ON session_items(productId);
`);

// Index for fast product lookup by branch
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_branch_products_branchId
  ON branch_products(branchId);
`);

// Index for fast product lookup by productId
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_branch_products_productId
  ON branch_products(productId);
`);

console.log("Database setup complete.");
export default db;
