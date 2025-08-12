import express from "express";
import {
    createSession, // Corrected from newSession
    getSessionById, // Corrected from viewSession
    getAllSessions,
    deleteSession,
    // editeSession, // Corrected from editeSession
} from "../controller/session.controller.js";

const router = express.Router();

// Session CRUD
router.post("/", createSession); // Create a new session
router.get("/", getAllSessions); // Get all sessions
router.get("/:sessionId", getSessionById); // Get a single session
// router.put("/:sessionId", editeSession); // Update session
router.delete("/:sessionId", deleteSession); // Delete session

export default router;
