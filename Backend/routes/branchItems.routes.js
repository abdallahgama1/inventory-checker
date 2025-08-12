// routes/branchItems.routes.js
import { Router } from "express";
import {
    addProductToBranch,
    getProductInBranch,
    getAllProductsInBranch,
    updateProductInBranch,
    deleteProductFromBranch,
} from "../controller/branchItems.controller.js";

const router = Router({ mergeParams: true }); // `mergeParams: true` is crucial if mounting this router on a parent router (e.g., branchRouter.use('/:branchId/products', branchItemsRouter))

router.post("/", addProductToBranch); // e.g., POST /api/branches/:branchId/products
router.get("/", getAllProductsInBranch); // e.g., GET /api/branches/:branchId/products
router.get("/:productId", getProductInBranch); // e.g., GET /api/branches/:branchId/products/:productId
router.put("/:productId", updateProductInBranch); // e.g., PUT /api/branches/:branchId/products/:productId
router.delete("/:productId", deleteProductFromBranch); // e.g., DELETE /api/branches/:branchId/products/:productId

export default router;
