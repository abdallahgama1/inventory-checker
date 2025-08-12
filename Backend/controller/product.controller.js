// controllers/product.controller.js
import * as ProductModel from "../models/product.model.js";

// --- Create a New Product ---
export const createProduct = async (req, res) => {
    try {
        const { product_name, product_sku, sellingPrice, costPrice } = req.body;

        // Basic input validation: Check if essential fields are present
        if (!product_name || !product_sku || !sellingPrice || !costPrice) {
            return res.status(400).json({
                message:
                    "Missing required product fields (productId, product_name, sellingPrice, costPrice).",
            });
        }
        if (
            isNaN(sellingPrice) ||
            (costPrice !== undefined && isNaN(costPrice))
        ) {
            return res.status(400).json({
                message:
                    "Quantity, selling price, and cost price (if provided) must be numbers.",
            });
        }

        const existingProduct = await ProductModel.getProductBySKU({
            product_sku: product_sku,
        });

        if (existingProduct) {
            return res.status(409).json({
                message: `Product with SKU '${product_sku}' already exists.`,
            });
        }

        const newProduct = await ProductModel.addProduct({
            product_name,
            product_sku,
            sellingPrice,
            costPrice,
        });
        res.status(201).json({
            message: "Product created successfully",
            product: newProduct,
        });
    } catch (error) {
        console.error("Error in createProduct controller:", error.message);
        res.status(500).json({
            message: "Failed to create product. Please try again later.",
        });
    }
};

// --- Get Product by ID ---
export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required." });
        }

        const product = await ProductModel.getProductById({ productId });

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(
            `Error in getProductById controller (ID: ${req.params.productId}):`,
            error.message
        );
        res.status(500).json({
            message: "Failed to retrieve product. Please try again later.",
        });
    }
};

// --- Get All Products ---
export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error in getAllProducts controller:", error.message);
        res.status(500).json({
            message: "Failed to retrieve products. Please try again later.",
        });
    }
};

// --- Update Product ---
export const updateProduct = async (req, res) => {
    const productId = req.params.id;

    if (!productId) {
        return res
            .status(400)
            .json({ message: "Product ID is required for update." });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res
            .status(400)
            .json({ message: "No fields provided for update." });
    }

    try {
        const currentProduct = await ProductModel.getProductById({
            productId: productId,
        });
        if (!currentProduct) {
            return res.status(404).json({ message: "Product not found." });
        }

        const updatedData = {
            product_name: req.body.product_name ?? currentProduct.product_name,
            product_sku: req.body.product_sku ?? currentProduct.product_sku,
            costPrice: req.body.costPrice ?? currentProduct.costPrice,
            sellingPrice: req.body.sellingPrice ?? currentProduct.sellingPrice,
        };

        if (
            (updatedData.sellingPrice !== undefined &&
                isNaN(updatedData.sellingPrice)) ||
            (updatedData.costPrice !== undefined &&
                isNaN(updatedData.costPrice))
        ) {
            return res.status(400).json({
                message:
                    "Quantity, selling price, and cost price must be numbers if provided.",
            });
        }

        const updatedProduct = await ProductModel.updateProductById({
            productId,
            productData: updatedData,
        });

        if (!updatedProduct) {
            return res
                .status(500)
                .json({ message: "Failed to update product." });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error(
            `Error in updateProduct controller (ID: ${productId}):`,
            error
        );
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// --- Delete Product ---
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        if (!productId) {
            return res
                .status(400)
                .json({ message: "Product ID is required for deletion." });
        }

        const success = await ProductModel.deleteProductById({ productId });

        if (!success) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
        console.error(
            `Error in deleteProduct controller (ID: ${req.params.productId}):`,
            error.message
        );
        res.status(500).json({
            message: "Failed to delete product. Please try again later.",
        });
    }
};
