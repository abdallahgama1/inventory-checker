// db/setup.js (or wherever your setup file is)
import dbPromise from "./config/db.js"; // CORRECTED: Import dbPromise, not db

const setup = async () => {
    const db = await dbPromise; // Get the resolved database instance
    await db.exec("PRAGMA foreign_keys = ON"); // Ensure foreign key constraints are enforced

    // Users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    // Products table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        productId INTEGER PRIMARY KEY AUTOINCREMENT, -- Renamed from 'id'
        product_name TEXT NOT NULL,                   -- Renamed from 'name'
        product_sku TEXT NOT NULL UNIQUE,             -- Renamed from 'sku'
        sellingPrice REAL NOT NULL,
        costPrice REAL NOT NULL,
        brand TEXT DEFAULT 'Unknown',
        category TEXT DEFAULT 'Generic'
      );
    `);

    // Sessions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // Session Items table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS session_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productId INTEGER NOT NULL,   -- This is the product's ID (FK to products)
        sessionId INTEGER NOT NULL,
        expected_quantity INTEGER NOT NULL,
        scanned_quantity INTEGER NOT NULL,
        sellingPrice REAL NOT NULL,
        costPrice REAL NOT NULL,
        product_name TEXT NOT NULL,   -- Added to match model
        product_sku TEXT NOT NULL,    -- Added to match model
        status TEXT NOT NULL CHECK(status IN ('Exact', 'Over Count', 'Under Count')),
        variance REAL NOT NULL,
        PRIMARY KEY (productId, sessionId), -- Composite primary key for uniqueness within a session
        FOREIGN KEY (sessionId) REFERENCES sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products(productId) ON DELETE CASCADE -- References the new productId in products table
      );
    `);

    // Branches table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS branches (
        branchId INTEGER PRIMARY KEY AUTOINCREMENT, -- Renamed from 'id'
        branch_name TEXT,                           -- Renamed from 'name'
        branch_location TEXT NOT NULL,              -- Renamed from 'location'
        contact_number TEXT,                        -- ADDED: Missing from original schema
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Branch Products table (e.g., inventory at a branch)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS branch_products (
        productId INTEGER NOT NULL,   -- This is the product's ID (FK to products)
        branchId INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        PRIMARY KEY (productId, branchId), -- Composite primary key for uniqueness within a branch
        FOREIGN KEY (branchId) REFERENCES branches(branchId) ON DELETE CASCADE, -- References new branchId
        FOREIGN KEY (productId) REFERENCES products(productId) ON DELETE CASCADE -- References new productId
      );
    `);

    // Index for fast session item lookup by sessionId
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_session_items_sessionId
      ON session_items(sessionId);
    `);

    // Index for fast session item lookup by productId
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_session_items_productId
      ON session_items(productId);
    `);

    // Index for fast product lookup by branch
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_branch_products_branchId
      ON branch_products(branchId);
    `);

    // Index for fast product lookup by productId
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_branch_products_productId
      ON branch_products(productId);
    `);

    console.log("Database setup complete.");
};

// You should export the setup function, not 'db' directly from this file.
// The 'dbPromise' should be exported from your 'config/db.js'
export default setup;
