import Router from "express";
import { newSession, viewSession, getAllSessions, deleteSession, editeSession } from "../controllers/session.controller.js";

const router = new Router();


// Session CRUD
router.post("/", newSession);                         // Create a new session
router.get("/", getAllSessions);                      // Get all sessions
router.get("/:sessionId", viewSession);               // Get a single session
router.put("/:sessionId", editeSession);              // Update session
router.delete("/:sessionId", deleteSession);          // Delete session

// Product operations inside a session
router.post('/:sessionId/products', addProductToSession);                   // Add product to session
router.put('/:sessionId/products/:productId', updateProductInSession);      // Edit product
router.delete('/:sessionId/products/:productId', deleteProductFromSession); // Delete product
router.get('/:sessionId/products', filterProductsInSession);                // Filter/search products


export default router; 