// controllers/branch.controller.js
import * as BranchModel from "../models/branch.model.js";

// --- Create a New Branch ---
export const createBranch = async (req, res) => {
    try {
        const branchData = req.body;

        if (
            !branchData.branch_name ||
            !branchData.branch_location ||
            !branchData.contact_number
        ) {
            return res.status(400).json({
                message:
                    "Missing required branch fields (branch_name, branch_location, contact_number).",
            });
        }

        const newBranch = await BranchModel.addBranch(branchData);
        res.status(201).json({
            message: "Branch created successfully",
            branch: newBranch,
        });
    } catch (error) {
        console.error("Error in createBranch controller:", error.message);
        res.status(500).json({
            message: "Failed to create branch. Please try again later.",
        });
    }
};

// --- Get Branch by ID ---
export const getBranchById = async (req, res) => {
    try {
        const { branchId } = req.params;

        if (!branchId) {
            return res.status(400).json({ message: "Branch ID is required." });
        }

        const branch = await BranchModel.getBranchById({ branchId });

        if (!branch) {
            return res.status(404).json({ message: "Branch not found." });
        }

        res.status(200).json(branch);
    } catch (error) {
        console.error(
            `Error in getBranchById controller (ID: ${req.params.branchId}):`,
            error.message
        );
        res.status(500).json({
            message: "Failed to retrieve branch. Please try again later.",
        });
    }
};

// --- Get All Branches ---
export const getAllBranches = async (req, res) => {
    try {
        const branches = await BranchModel.getAllBranches();
        res.status(200).json(branches);
    } catch (error) {
        console.error("Error in getAllBranches controller:", error.message);
        res.status(500).json({
            message: "Failed to retrieve branches. Please try again later.",
        });
    }
};

// --- Update Branch ---
export const updateBranch = async (req, res) => {
    try {
        const { branchId } = req.params;
        const { branch_name, branch_location, contact_number } = req.body || {};

        if (!branchId) {
            return res.status(400).json({
                message: "Branch ID is required for update.",
            });
        }

        if (!branch_name && !branch_location && !contact_number) {
            return res.status(400).json({
                message: "No fields provided for update.",
            });
        }

        const existingBranch = await BranchModel.getBranchById({ branchId });

        if (!existingBranch) {
            return res.status(404).json({
                message: "Branch not found.",
            });
        }

        const updatedBranch = await BranchModel.updateBranchById({
            branchId,
            branchData: {
                branch_name: branch_name ?? existingBranch.branch_name,
                branch_location:
                    branch_location ?? existingBranch.branch_location,
                contact_number: contact_number ?? existingBranch.contact_number,
            },
        });

        if (!updatedBranch) {
            return res.status(400).json({
                message: "No changes were made to the branch.",
            });
        }

        res.status(200).json({
            message: "Branch updated successfully",
            branch: updatedBranch,
        });
    } catch (error) {
        console.error(
            `❌ Error in updateBranch controller (ID: ${req.params.branchId}):`,
            error.message
        );
        res.status(500).json({
            message: "Failed to update branch. Please try again later.",
        });
    }
};

// --- Delete Branch ---
export const deleteBranch = async (req, res) => {
    try {
        const { branchId } = req.params;

        if (!branchId) {
            return res
                .status(400)
                .json({ message: "Branch ID is required for deletion." });
        }

        const success = await BranchModel.deleteBranchById(branchId);

        if (!success) {
            return res.status(404).json({ message: "Branch not found." });
        }

        res.status(204).send();
    } catch (error) {
        console.error(
            `Error in deleteBranch controller (ID: ${req.params.branchId}):`,
            error.message
        );
        res.status(500).json({
            message: "Failed to delete branch. Please try again later.",
        });
    }
};
