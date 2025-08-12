// controllers/session.controller.js
import * as SessionModel from "../models/session.model.js";

// --- Create a New Session ---
export const createSession = async (req, res) => {
    try {
        const userId = req.user.id;

        const newSession = await SessionModel.newSession({ userId });
        res.status(201).json({
            message: "Session created successfully",
            session: newSession,
        });
    } catch (error) {
        console.error("Error in createSession controller:", error.message);
        res.status(500).json({
            message: "Failed to create session. Please try again later.",
        });
    }
};

// --- Get Session by ID ---
export const getSessionById = async (req, res) => {
    try {
        const id = req.params.sessionId;

        if (isNaN(id)) {
            return res
                .status(400)
                .json({ message: "Invalid session ID format." });
        }

        const session = await SessionModel.getSession(id);

        if (!session) {
            return res.status(404).json({ message: "Session not found." });
        }

        res.status(200).json(session);
    } catch (error) {
        console.error(
            `Error in getSessionById controller (ID: ${req.params.id}):`,
            error.message
        );
        res.status(500).json({
            message: "Failed to retrieve session. Please try again later.",
        });
    }
};

// --- Get All Sessions ---
export const getAllSessions = async (req, res) => {
    try {
        const sessions = await SessionModel.getAllSessions();
        res.status(200).json(sessions);
    } catch (error) {
        console.error("Error in getAllSessions controller:", error.message);
        res.status(500).json({
            message: "Failed to retrieve sessions. Please try again later.",
        });
    }
};

// --- Delete Session ---
export const deleteSession = async (req, res) => {
    try {
        const id = req.params.sessionId;

        if (isNaN(id)) {
            return res
                .status(400)
                .json({ message: "Invalid session ID format." });
        }

        const success = await SessionModel.deleteSession(id);
        console.log(success);
        if (!success) {
            return res.status(404).json({ message: "Session not found." });
        }

        res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
        console.error(
            `Error in deleteSession controller (ID: ${req.params.id}):`,
            error.message
        );
        res.status(500).json({
            message: "Failed to delete session. Please try again later.",
        });
    }
};

// --- Edit Session (Update) ---
