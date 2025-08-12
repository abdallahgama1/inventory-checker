// controllers/branchItems.controller.js
import * as BranchItemsModel from "../models/branchItems.model.js";
import * as BranchModel from "../models/branch.model.js"; // To verify branch existence
import * as ProductModel from "../models/product.model.js"; // To verify product existence

// --- Add Product to a Branch ---
export const addProductToBranch = async (req, res) => {
    try {
        const { branchId } = req.params;
        const { productSKU, quantity } = req.body;

        if (!branchId || !productSKU || !quantity) {
            return res.status(400).json({
                message: "branchId and productSKU and quantity are required.",
            });
        }

        const branchExists = await BranchModel.getBranchById({ branchId });
        if (!branchExists) {
            return res.status(404).json({ message: "Branch not found." });
        }

        const productDetails = await ProductModel.getProductBySKU({
            product_sku: productSKU,
        });
        if (!productDetails) {
            return res
                .status(404)
                .json({ message: "Product not found in main inventory." });
        }

        const existingBranchProduct = await BranchItemsModel.getProductInBranch(
            { branchId, product_sku: productSKU }
        );
        let newBranchProduct;
        if (existingBranchProduct) {
            newBranchProduct = await BranchItemsModel.updateProductInBranch({
                branchId,
                product_sku: productSKU,
                quantity: existingBranchProduct.quantity + quantity,
            });
        } else {
            newBranchProduct = await BranchItemsModel.addProductToBranch({
                branchId,
                product_sku: productSKU,
                quantity,
            });
        }

        res.status(201).json({
            message: "Product added to branch successfully",
            item: newBranchProduct,
        });
    } catch (error) {
        console.error(
            `Error in addProductToBranch controller (Branch ID: ${req.params.branchId}):`,
            error.message
        );
        res.status(500).json({
            message: "Failed to add product to branch. Please try again later.",
        });
    }
};

// --- Get Single Product in Branch ---
export const getProductInBranch = async (req, res) => {
    try {
        const { branchId, productId } = req.params; // Assuming URL like /branches/:branchId/products/:productId

        if (!branchId || !productId) {
            return res
                .status(400)
                .json({ message: "Branch ID and Product ID are required." });
        }

        const branchItem = await BranchItemsModel.getProductInBranch(
            branchId,
            productId
        );

        if (!branchItem) {
            return res
                .status(404)
                .json({ message: "Product not found in this branch." });
        }

        res.status(200).json(branchItem);
    } catch (error) {
        console.error(
            `Error in getProductInBranch controller (Branch ID: ${req.params.branchId}, Product ID: ${req.params.productId}):`,
            error.message
        );
        res.status(500).json({
            message:
                "Failed to retrieve product from branch. Please try again later.",
        });
    }
};

// --- Get All Products in a Branch ---
export const getAllProductsInBranch = async (req, res) => {
    try {
        const { branchId } = req.params;

        if (!branchId) {
            return res.status(400).json({ message: "Branch ID is required." });
        }

        const branchItems = await BranchItemsModel.getAllProductsInBranch(
            branchId
        );
        res.status(200).json(branchItems);
    } catch (error) {
        console.error(
            `Error in getAllProductsInBranch controller (Branch ID: ${req.params.branchId}):`,
            error.message
        );
        res.status(500).json({
            message: "Failed to retrieve branch items. Please try again later.",
        });
    }
};

// --- Update Product in Branch ---
export const updateProductInBranch = async (req, res) => {
    try {
        const { branchId, productId } = req.params;
        const productData = req.body; // Expecting updated quantity, sellingPrice, costPrice, etc.

        if (!branchId || !productId) {
            return res.status(400).json({
                message: "Branch ID and Product ID are required for update.",
            });
        }

        if (Object.keys(productData).length === 0) {
            return res
                .status(400)
                .json({ message: "No fields provided for update." });
        }

        // Validate numeric fields if they are present in productData
        if (
            (productData.quantity !== undefined &&
                isNaN(productData.quantity)) ||
            (productData.sellingPrice !== undefined &&
                isNaN(productData.sellingPrice)) ||
            (productData.costPrice !== undefined &&
                isNaN(productData.costPrice))
        ) {
            return res.status(400).json({
                message:
                    "Quantity, selling price, and cost price must be numbers if provided.",
            });
        }

        const updatedBranchItem = await BranchItemsModel.updateProductInBranch(
            branchId,
            productId,
            productData
        );

        if (!updatedBranchItem) {
            return res.status(404).json({
                message: "Product not found in branch or no changes made.",
            });
        }

        res.status(200).json({
            message: "Product in branch updated successfully",
            item: updatedBranchItem,
        });
    } catch (error) {
        console.error(
            `Error in updateProductInBranch controller (Branch ID: ${req.params.branchId}, Product ID: ${req.params.productId}):`,
            error.message
        );
        res.status(500).json({
            message:
                "Failed to update product in branch. Please try again later.",
        });
    }
};

// --- Delete Product from Branch ---
export const deleteProductFromBranch = async (req, res) => {
    try {
        const { branchId, productId } = req.params;

        if (!branchId || !productId) {
            return res.status(400).json({
                message: "Branch ID and Product ID are required for deletion.",
            });
        }

        const success = await BranchItemsModel.deleteProductFromBranch(
            branchId,
            productId
        );

        if (!success) {
            return res
                .status(404)
                .json({ message: "Product not found in branch." });
        }

        res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
        console.error(
            `Error in deleteProductFromBranch controller (Branch ID: ${req.params.branchId}, Product ID: ${req.params.productId}):`,
            error.message
        );
        res.status(500).json({
            message:
                "Failed to delete product from branch. Please try again later.",
        });
    }
};
