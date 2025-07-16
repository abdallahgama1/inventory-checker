import db from "../config/db.js";
import {
    validateId,
    validateUpdateProductInSession,
    validateDeleteProductFromSession,
    validateAddProductToSession,
    validateFilterProductsInSession,
} from "../utils/sessionContent.validator.js";
export const addProductToSession = (sessionId, productData) => {
    const stmt = db.prepare(
        `INSERT INTO session_products (
            sessionId, 
            productId, 
            product_name, 
            product_sku,
            quantity, 
            sellingPrice, 
            costPrice, 
            status, 
            variance
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const result = stmt.run(
        sessionId,
        productData.productId,
        productData.product_name,
        productData.product_sku,
        productData.quantity,
        productData.sellingPrice,
        productData.costPrice,
        productData.status,
        productData.variance
    );
    return result.lastInsertRowid;
};

export const updateProductInSession = (sessionId, productId, productData) => {
    const stmt = db.prepare(`
        UPDATE session_products
        SET product_name = ?, quantity = ?, price = ?
        WHERE session_id = ? AND id = ?
    `);
    const result = stmt.run(
        productData.product_name,
        productData.quantity,
        productData.price,
        sessionId,
        productId
    );
    return result.changes > 0; // returns true if a row was updated
};

export const deleteProductFromSession = (sessionId, productId) => {
    const stmt = db.prepare(`
        DELETE FROM session_products
        WHERE session_id = ? AND id = ?
    `);
    return stmt.run(sessionId, productId);
};

export const filterProductsInSession = (sessionId, filter) => {
    const query = `
        SELECT * FROM session_products
        WHERE session_id = ?
        ${filter ? `AND product_name LIKE ?` : ""}
    `;
    const stmt = db.prepare(query);
    return filter ? stmt.all(sessionId, `%${filter}%`) : stmt.all(sessionId);
};
