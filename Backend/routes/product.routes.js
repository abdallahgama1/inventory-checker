import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controller/product.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById); // Matches controller (assumes :id maps to productId)
router.post("/", createProduct);
router.put("/:id", updateProduct); // Matches controller (assumes :id maps to productId)
router.delete("/:id", deleteProduct); // Matches controller (assumes :id maps to productId)

export default router;
