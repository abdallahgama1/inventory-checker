import {
    createBranch, // -> Should be createBranch
    getAllBranches,
    getBranchById, // -> Should be getBranchById
    updateBranch,
    deleteBranch,
} from "../controller/branch.controller.js"; // Note: It's 'controllers', not 'controller' in path if consistent

import { Router } from "express";

const router = Router();

router.post("/", createBranch); // Route for createBranch
router.get("/", getAllBranches);
router.get("/:branchId", getBranchById); // Route for getBranchById
router.put("/:branchId", updateBranch);
router.delete("/:id", deleteBranch);

export default router;
