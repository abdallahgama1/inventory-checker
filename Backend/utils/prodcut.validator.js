export const validateProductData = (data) => {
    const {
        productId,
        product_name,
        product_sku,
        quantity,
        sellingPrice,
        costPrice,
    } = data;

    // Check presence of required fields
    if (
        !productId ||
        !product_name ||
        !product_sku ||
        quantity === undefined ||
        sellingPrice === undefined ||
        costPrice === undefined
    ) {
        return { valid: false, error: "All fields are required" };
    }

    // Validate types and values
    if (typeof productId !== "number" || productId <= 0) {
        return { valid: false, error: "Invalid product ID" };
    }

    if (typeof quantity !== "number" || quantity < 0) {
        return {
            valid: false,
            error: "Quantity must be a non-negative number",
        };
    }

    if (typeof sellingPrice !== "number" || sellingPrice < 0) {
        return {
            valid: false,
            error: "Selling price must be a non-negative number",
        };
    }

    if (typeof costPrice !== "number" || costPrice < 0) {
        return {
            valid: false,
            error: "Cost price must be a non-negative number",
        };
    }

    if (typeof product_name !== "string" || product_name.trim() === "") {
        return {
            valid: false,
            error: "Product name must be a non-empty string",
        };
    }
    if (typeof product_sku !== "string" || !product_sku.trim()) {
        return {
            valid: false,
            error: "Product SKU must be a non-empty string",
        };
    }

    return {
        valid: true,
        data: {
            productId: productId,
            product_sku: product_sku.trim(),
            product_name: product_name.trim(),
            quantity,
            sellingPrice,
            costPrice,
        },
    };
};

export const validateUpdateProductDataPartial = (data) => {
    if (!data || Object.keys(data).length === 0) {
        return { valid: false, error: "No fields provided for update" };
    }
    const allowedFields = [
        "product_name",
        "product_sku",
        "quantity",
        "sellingPrice",
        "costPrice",
        "status",
        "variance",
    ];
    const updates = {};
    for (const [key, value] of Object.entries(data)) {
        if (!allowedFields.includes(key)) {
            return { valid: false, error: `Invalid field: ${key}` };
        }
        if (key === "quantity" && (typeof value !== "number" || value < 0)) {
            return {
                valid: false,
                error: "Quantity must be a non-negative number",
            };
        }
        if (
            key === "sellingPrice" &&
            (typeof value !== "number" || value < 0)
        ) {
            return {
                valid: false,
                error: "Selling price must be a non-negative number",
            };
        }
        if (key === "costPrice" && (typeof value !== "number" || value < 0)) {
            return {
                valid: false,
                error: "Cost price must be a non-negative number",
            };
        }
        if (
            key === "status" &&
            !["Exact", "Over Count", "Under Count"].includes(value.trim())
        ) {
            return {
                valid: false,
                error: "Status must be one of: 'Exact', 'Over Count', or 'Under Count'",
            };
        }
        if (key === "variance" && typeof value !== "number") {
            return { valid: false, error: "Variance must be a number" };
        }
        if (key === "product_name" && typeof value !== "string") {
            return { valid: false, error: "Product name must be a string" };
        }
        if (key === "product_sku" && typeof value !== "string") {
            return { valid: false, error: "Product SKU must be a string" };
        }
        if (
            key === "product_name" ||
            key === "product_sku" ||
            key === "status"
        ) {
            updates[key] = value.trim(); // fix: assign trimmed value
        } else {
            updates[key] = value; // fallback for other keys
        }
    }
    return {
        valid: true,
        updates: updates,
    };
};

// export const validateProductId = (id) => {
//     if (id === undefined || id === null || id === "") {
//         return { valid: false, error: "User ID is required" };
//     }

//     const idNum = Number(id);
//     if (!Number.isInteger(idNum) || idNum <= 0) {
//         return { valid: false, error: "User ID must be a positive integer." };
//     }

//     return { valid: true, data: { id: idNum } };
// };
