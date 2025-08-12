// controllers/sessionItems.controller.js
import * as SessionItemsModel from "../models/sessionItems.model.js";
import * as SessionModel from "../models/session.model.js"; // To verify session existence
import * as ProductModel from "../models/product.model.js"; // To verify product existence

// --- Add Product to a Session ---
export const addProductToSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { productSKU, scannedQty } = req.body;

        if (!sessionId || !productSKU || !scannedQty) {
            return res.status(400).json({
                message: "sessionId, productSKU, and scannedQty are required.",
            });
        }

        const session = await SessionModel.getSessionById({ sessionId });
        if (!session) {
            return res.status(404).json({ message: "Session not found." });
        }

        const existingProduct =
            await SessionItemsModel.getProductInSessionBySKU({
                sessionId,
                product_sku: productSKU,
            });

        const product = existingProduct
            ? existingProduct
            : await ProductModel.getProductBySKU({ product_sku: productSKU });

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const scanned_Qty = Number(scannedQty);
        const expected_Qty = Number(product.expected_quantity || 0);
        const variance = scanned_Qty - expected_Qty;

        let status = "Exact";
        if (variance > 0) status = "Over Count";
        else if (variance < 0) status = "Under Count";

        let sessionItem;

        if (!existingProduct) {
            sessionItem = await SessionItemsModel.addProductToSession({
                sessionId,
                productData: {
                    ...product,
                    scanned_quantity: scanned_Qty,
                    variance,
                    status,
                    expected_quantity: expected_Qty,
                },
            });
        } else {
            sessionItem = await SessionItemsModel.updateProductInSession({
                sessionId,
                productData: {
                    productId: existingProduct.productId,
                    scanned_quantity: scanned_Qty,
                    variance,
                    status,
                },
            });
        }

        return res.status(201).json({
            message: "Product added to session successfully",
            item: sessionItem,
        });
    } catch (error) {
        console.error(
            `❌ Error in addProductToSession (Session ID: ${req.params.sessionId}):`,
            error.message
        );
        return res.status(500).json({
            message:
                "Failed to add product to session. Please try again later.",
        });
    }
};

// --- Get Single Product in Session ---
export const getProductInSession = async (req, res) => {
    try {
        const { sessionId, productId } = req.params; // Assuming URL like /sessions/:sessionId/items/:productId

        if (!sessionId || !productId) {
            return res
                .status(400)
                .json({ message: "Session ID and Product ID are required." });
        }

        const session = await SessionModel.getSessionById({ sessionId });
        if (!session) {
            return res.status(404).json({ message: "Session not found." });
        }
        const sessionItem = await SessionItemsModel.getProductInSessionById({
            sessionId,
            productId,
        });

        if (!sessionItem) {
            return res
                .status(404)
                .json({ message: "Product not found in this session." });
        }

        res.status(200).json(sessionItem);
    } catch (error) {
        console.error(
            `Error in getProductInSession controller (Session ID: ${req.params.sessionId}, Product ID: ${req.params.productId}):`,
            error.message
        );
        res.status(500).json({
            message:
                "Failed to retrieve product from session. Please try again later.",
        });
    }
};

// --- Get All Products in a Session ---
export const getAllProductsInSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({ message: "Session ID is required." });
        }

        const sessionItems = await SessionItemsModel.getAllProductsInSession({
            sessionId,
        });
        res.status(200).json(sessionItems);
    } catch (error) {
        console.error(
            `Error in getAllProductsInSession controller (Session ID: ${req.params.sessionId}):`,
            error.message
        );
        res.status(500).json({
            message:
                "Failed to retrieve session items. Please try again later.",
        });
    }
};

// --- Update Product in Session ---
export const updateProductInSession = async (req, res) => {
    try {
        const { sessionId, productId } = req.params; // Assuming productId from URL (this is the `id` field in your session_products table)
        const productData = req.body; // Expecting updated quantity, status, variance

        if (!sessionId || !productId) {
            return res.status(400).json({
                message: "Session ID and Product ID are required for update.",
            });
        }

        if (Object.keys(productData).length === 0) {
            return res
                .status(400)
                .json({ message: "No fields provided for update." });
        }

        productData.productId = productId;

        const updatedSessionItem =
            await SessionItemsModel.updateProductInSession(
                sessionId,
                productData
            );

        if (!updatedSessionItem) {
            return res.status(404).json({
                message: "Product not found in session or no changes made.",
            });
        }

        res.status(200).json({
            message: "Product in session updated successfully",
            item: updatedSessionItem,
        });
    } catch (error) {
        console.error(
            `Error in updateProductInSession controller (Session ID: ${req.params.sessionId}, Product ID: ${req.params.productId}):`,
            error.message
        );
        res.status(500).json({
            message:
                "Failed to update product in session. Please try again later.",
        });
    }
};

// --- Delete Product from Session ---
export const deleteProductFromSession = async (req, res) => {
    try {
        const { sessionId, productId } = req.params;

        if (!sessionId || !productId) {
            return res.status(400).json({
                message: "Session ID and Product ID are required for deletion.",
            });
        }

        const session = await SessionModel.getSessionById({ sessionId });
        if (!session) {
            return res.status(404).json({ message: "Session not found." });
        }
        const deleted = await SessionItemsModel.deleteProductFromSession({
            sessionId,
            productId,
        });

        if (!deleted) {
            return res
                .status(404)
                .json({ message: "Product not found in session." });
        }

        res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
        console.error(
            `Error in deleteProductFromSession controller (Session ID: ${req.params.sessionId}, Product ID: ${req.params.productId}):`,
            error.message
        );
        res.status(500).json({
            message:
                "Failed to delete product from session. Please try again later.",
        });
    }
};
