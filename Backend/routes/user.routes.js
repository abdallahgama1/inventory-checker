import express from "express"; // Import 'express' as an object if using `express.Router()` directly, or remove if just using Router()
import {
    updateUser,
    getUserById, // -> Should be getUserById
    getAllUsers,
    deleteUser,
} from "../controller/user.controller.js";

const router = express.Router(); // Correct way to initialize Router with express

router.put("/", updateUser);
router.get("/:id", getUserById); // Route for getUserById
router.get("/", getAllUsers);
router.delete("/:id", deleteUser);

export default router;
