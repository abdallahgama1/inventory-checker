import dbPromise from "../config/db.js"; // Changed to dbPromise for consistency

// Add product to a branch
export const addProductToBranch = async ({
    branchId,
    product_sku,
    quantity,
}) => {
    const db = await dbPromise; // Get the database instance
    try {
        const query = `
            INSERT INTO Branch_products (
                branchId,
                product_sku,
                quantity,
            ) VALUES (?, ?, ?)
        `;
        const values = [branchId, product_sku, quantity];

        const result = await db.run(query, values);

        return {
            id: result.lastID,
            branchId,
            product_sku,
            quantity,
        };
    } catch (error) {
        console.error(`Error adding product to branch ${branchId}:`, error);
        throw error;
    }
};

// Get a product in a branch
export const getProductInBranch = async ({ branchId, product_sku }) => {
    const db = await dbPromise;
    try {
        const query = `
            SELECT * FROM Branch_products
            WHERE branchId = ? AND product_sku = ?
        `;
        const row = await db.get(query, [branchId, product_sku]);
        return row;
    } catch (error) {
        console.error(
            `Error getting product ${product_sku} in branch ${branchId}:`,
            error
        );
        throw error;
    }
};

// Get all products in a branch
export const getAllProductsInBranch = async ({ branchId }) => {
    const db = await dbPromise;
    try {
        const query = `
            SELECT * FROM Branch_products
            WHERE branchId = ?
        `;
        const rows = await db.all(query, [branchId]);
        return rows;
    } catch (error) {
        console.error(
            `Error getting all products in branch ${branchId}:`,
            error
        );
        throw error;
    }
};

// Update a product in a branch
export const updateProductInBranch = async ({
    branchId,
    product_sku,
    quantity,
}) => {
    const db = await dbPromise;
    try {
        const query = `
            UPDATE Branch_products
            SET quantity = ?
            WHERE branchId = ? AND product_sku = ?
        `;
        const values = [quantity, branchId, product_sku];

        const result = await db.run(query, values);

        if (result.changes === 0) return null; // No rows updated

        return {
            id: result.lastID,
            branchId,
            product_sku,
            quantity,
        };
    } catch (error) {
        console.error(
            `Error updating product ${productId} in branch ${branchId}:`,
            error
        );
        throw error;
    }
};

// Delete product from branch
export const deleteProductFromBranch = async ({ branchId, product_sku }) => {
    const db = await dbPromise;
    try {
        const query = `
            DELETE FROM Branch_products
            WHERE branchId = ? AND product_sku = ?
        `;
        const result = await db.run(query, [branchId, product_sku]);
        return result.changes > 0;
    } catch (error) {
        console.error(
            `Error deleting product ${product_sku} from branch ${branchId}:`,
            error
        );
        throw error;
    }
};
