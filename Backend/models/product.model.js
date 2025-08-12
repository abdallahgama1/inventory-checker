import dbPromise from "../config/db.js";

// Add a new product
export const addProduct = async (productData) => {
    const db = await dbPromise;
    try {
        const result = await db.run(
            `
            INSERT INTO products (
                product_name,
                product_sku,
                sellingPrice,
                costPrice
            ) VALUES (?, ?, ?, ?)`,
            [
                productData.product_name,
                productData.product_sku,
                productData.sellingPrice,
                productData.costPrice,
            ]
        );

        return {
            id: result.lastID,
            ...productData,
        };
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};

// Get a product by productId
export const getProductById = async ({ productId }) => {
    const db = await dbPromise;
    try {
        const row = await db.get(
            `
            SELECT * FROM products
            WHERE productId = ?`,
            [productId]
        );
        return row;
    } catch (error) {
        console.error(`Error getting product by ID ${productId}:`, error);
        throw error;
    }
};

export const getProductBySKU = async ({ product_sku }) => {
    const db = await dbPromise;
    try {
        const row = await db.get(
            `
            SELECT * FROM products
            WHERE product_sku = ?`,
            [product_sku]
        );
        return row;
    } catch (error) {
        console.error(`Error getting product by SKU ${product_sku}:`, error);
        throw error;
    }
};

// Get all products
export const getAllProducts = async () => {
    const db = await dbPromise;
    try {
        const rows = await db.all(`SELECT * FROM products`);
        return rows;
    } catch (error) {
        console.error("Error getting all products:", error);
        throw error;
    }
};

// Update a product by productId
export const updateProductById = async ({ productId, productData }) => {
    const db = await dbPromise;
    try {
        const result = await db.run(
            `
            UPDATE products
            SET product_name = ?, product_sku = ?, sellingPrice = ?, costPrice = ?
            WHERE productId = ?`,
            [
                productData.product_name,
                productData.product_sku,
                productData.sellingPrice,
                productData.costPrice,
                productId,
            ]
        );

        if (result.changes === 0) return null; // Return null if no row was updated
        return {
            id: productId,
            ...productData,
        };
    } catch (error) {
        console.error(`Error updating product by ID ${productId}:`, error);
        throw error;
    }
};

// Delete a product by productId
export const deleteProductById = async ({ productId }) => {
    const db = await dbPromise;
    try {
        const result = await db.run(
            `
            DELETE FROM products
            WHERE productId = ?`,
            [productId]
        );

        return result.changes > 0; // true if a row was deleted
    } catch (error) {
        console.error(`Error deleting product by ID ${productId}:`, error);
        throw error;
    }
};
