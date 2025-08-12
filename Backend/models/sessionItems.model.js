import dbPromise from "../config/db.js";

// Add product to session
export const addProductToSession = async ({ sessionId, productData }) => {
    const db = await dbPromise;
    try {
        const result = await db.run(
            `INSERT INTO session_items (
                sessionId,
                productId,
                product_name,
                product_sku,
                expected_quantity,
                scanned_quantity,
                sellingPrice,
                costPrice,
                status,
                variance
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                sessionId,
                productData.productId,
                productData.product_name,
                productData.product_sku,
                productData.expected_quantity,
                productData.scanned_quantity,
                productData.sellingPrice,
                productData.costPrice,
                productData.status,
                productData.variance,
            ]
        );

        return {
            id: result.lastID,
            sessionId,
            ...productData,
        };
    } catch (error) {
        console.error(`Error adding product to session ${sessionId}:`, error);
        throw error;
    }
};

// Get single product in session
export const getProductInSessionById = async ({ sessionId, productId }) => {
    const db = await dbPromise;
    try {
        return await db.get(
            `SELECT * FROM session_items WHERE sessionId = ? AND productId = ?`,
            [sessionId, productId]
        );
    } catch (error) {
        console.error(
            `Error getting product ${productId} in session ${sessionId}:`,
            error
        );
        throw error;
    }
};

// Get single product in session
export const getProductInSessionBySKU = async ({ sessionId, product_sku }) => {
    const db = await dbPromise;
    try {
        return await db.get(
            `SELECT * FROM session_items WHERE sessionId = ? AND product_sku = ?`,
            [sessionId, product_sku]
        );
    } catch (error) {
        console.error(
            `Error getting product ${product_sku} in session ${sessionId}:`,
            error
        );
        throw error;
    }
};

// Get all products in a session
export const getAllProductsInSession = async ({ sessionId }) => {
    const db = await dbPromise;
    try {
        return await db.all(`SELECT * FROM session_items WHERE sessionId = ?`, [
            sessionId,
        ]);
    } catch (error) {
        console.error(
            `Error getting all products in session ${sessionId}:`,
            error
        );
        throw error;
    }
};

// Update product in session
export const updateProductInSession = async ({ sessionId, productData }) => {
    const db = await dbPromise;
    try {
        const result = await db.run(
            `UPDATE session_items
             SET scanned_quantity = ?, status = ?, variance = ?
             WHERE sessionId = ? AND productId = ?`,
            [
                productData.scanned_quantity,
                productData.status,
                productData.variance,
                sessionId,
                productData.productId, // Assuming productData.productId holds the ID for WHERE clause
            ]
        );
        console.log(productData);
        console.log(result);
        if (result.changes === 0) return null;

        return {
            id: productData.productId,
            sessionId,
            ...productData,
        };
    } catch (error) {
        console.error(`Error updating product in session ${sessionId}:`, error);
        throw error;
    }
};

// Delete product from session
export const deleteProductFromSession = async ({ sessionId, productId }) => {
    const db = await dbPromise;
    try {
        const result = await db.run(
            `DELETE FROM session_items WHERE sessionId = ? AND productId = ?`,
            [sessionId, productId]
        );
        return result.changes > 0;
    } catch (error) {
        console.error(
            `Error deleting product ${productId} from session ${sessionId}:`,
            error
        );
        throw error;
    }
};
