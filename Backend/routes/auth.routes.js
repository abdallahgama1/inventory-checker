import express from "express";
import {
    register, // -> Should be register
    login, // -> Should be login
    logout, // -> Should be logout
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", register); // Route for register
router.post("/login", login); // Route for login
router.get("/logout", logout); // Route for logout

export default router;
