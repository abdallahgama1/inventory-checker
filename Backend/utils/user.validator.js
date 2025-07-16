import { emailRegex, nameRegex, passwordRegex } from "../utils/regex.js";

export const validateNewUser = ({ name, email, password }) => {
    if (!name || !email || !password) {
        return { valid: false, error: "All fields are required" };
    }

    if (!emailRegex.test(email.trim())) {
        return { valid: false, error: "Invalid email format" };
    }

    if (!nameRegex.test(name.trim())) {
        return { valid: false, error: "Name must be alphanumeric" };
    }

    if (!passwordRegex.test(password.trim())) {
        return {
            valid: false,
            error: "Password must be at least 6 characters and contain only a-z, A-Z, 0-9, @#$%^&+=",
        };
    }

    return {
        valid: true,
        data: {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
        },
    };
};

export const validateUserUpdate = (fields) => {
    if (!fields || Object.keys(fields).length === 0) {
        return { valid: false, error: "No fields provided for update" };
    }
    if (fields.email && !emailRegex.test(fields.email.trim())) {
        return { valid: false, error: "Invalid email format" };
    }
    if (fields.name && !nameRegex.test(fields.name.trim())) {
        return { valid: false, error: "Name must be alphanumeric" };
    }
    if (fields.password && !passwordRegex.test(fields.password.trim())) {
        return {
            valid: false,
            error: "Password must be at least 6 characters and contain only a-z, A-Z, 0-9, @#$%^&+=",
        };
    }

    const updates = {};

    if (fields.name) updates.name = fields.name.trim();
    if (fields.email) updates.email = fields.email.trim();
    if (fields.password) updates.password = fields.password.trim();
    return { valid: true, data: updates };
};

export const validateUserId = (id) => {
    if (id === undefined || id === null || id === "") {
        return { valid: false, error: "User ID is required" };
    }

    const idNum = Number(id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
        return { valid: false, error: "User ID must be a positive integer." };
    }

    return { valid: true, data: { id: idNum } };
};
