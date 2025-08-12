// routes/sessionItems.routes.js
import { Router } from "express";
import {
    addProductToSession,
    getProductInSession,
    getAllProductsInSession,
    updateProductInSession,
    deleteProductFromSession,
} from "../controller/sessionItems.controller.js";

const router = Router({ mergeParams: true }); // `mergeParams: true` is crucial here

router.post("/", addProductToSession); // e.g., POST /api/sessions/:sessionId/items
router.get("/", getAllProductsInSession); // e.g., GET /api/sessions/:sessionId/items
router.get("/:productId", getProductInSession); // e.g., GET /api/sessions/:sessionId/items/:productId
router.put("/:productId", updateProductInSession); // e.g., PUT /api/sessions/:sessionId/items/:productId
router.delete("/:productId", deleteProductFromSession); // e.g., DELETE /api/sessions/:sessionId/items/:productId

export default router;
