import dbPromise from "../config/db.js"; // Changed to dbPromise for consistency

export const addBranch = async (branchData) => {
    const db = await dbPromise;
    try {
        const result = await db.run(
            `INSERT INTO branches (
                branchId,
                branch_name,
                branch_location,
                contact_number
            ) VALUES (?, ?, ?, ?)`,
            [
                branchData.branchId,
                branchData.branch_name,
                branchData.branch_location,
                branchData.contact_number,
            ]
        );

        return {
            id: result.lastID,
            ...branchData,
        };
    } catch (error) {
        console.error("Error adding branch:", error);
        throw error;
    }
};

export const getBranchById = async ({ branchId }) => {
    const db = await dbPromise;
    try {
        const branch = await db.get(
            `SELECT * FROM branches WHERE branchId = ?`,
            [branchId]
        );
        return branch;
    } catch (error) {
        console.error(`Error getting branch by ID ${branchId}:`, error);
        throw error;
    }
};

export const getAllBranches = async () => {
    const db = await dbPromise;
    try {
        const branches = await db.all(`SELECT * FROM branches`);
        return branches;
    } catch (error) {
        console.error("Error getting all branches:", error);
        throw error;
    }
};

export const updateBranchById = async ({ branchId, branchData }) => {
    const db = await dbPromise;
    try {
        const result = await db.run(
            `UPDATE branches
             SET branch_name = ?, branch_location = ?, contact_number = ?
             WHERE branchId = ?`,
            [
                branchData.branch_name,
                branchData.branch_location,
                branchData.contact_number,
                branchId,
            ]
        );
        return result.changes > 0 ? { id: branchId, ...branchData } : null;
    } catch (error) {
        console.error(`Error updating branch by ID ${branchId}:`, error);
        throw error;
    }
};

export const deleteBranchById = async ({ branchId }) => {
    const db = await dbPromise;
    try {
        const result = await db.run(`DELETE FROM branches WHERE branchId = ?`, [
            branchId,
        ]);
        return result.changes > 0;
    } catch (error) {
        console.error(`Error deleting branch by ID ${branchId}:`, error);
        throw error;
    }
};
