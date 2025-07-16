import { validateId } from "./user.validator.js";

export const validateAddProductToSession = (sessionId, productId, quantity) => {
    const { valid: validSessionId, id: parsedSessionId } =
        validateId(sessionId);
    if (!validSessionId) {
        return { valid: false, error: "Invalid session ID" };
    }

    const { valid: validProductId, id: parsedProductId } =
        validateId(productId);
    if (!validProductId) {
        return { valid: false, error: "Invalid product ID" };
    }

    if (typeof quantity !== "number" || quantity < 0) {
        return {
            valid: false,
            error: "Quantity must be a non-negative number",
        };
    }

    return {
        valid: true,
        data: {
            sessionId: parsedSessionId,
            productId: parsedProductId,
            quantity,
        },
    };
};

export const validateUpdateProductInSession = (
    sessionId,
    productId,
    quantity
) => {
    const { valid: validSessionId, id: parsedSessionId } =
        validateId(sessionId);
    if (!validSessionId) {
        return { valid: false, error: "Invalid session ID" };
    }

    const { valid: validProductId, id: parsedProductId } =
        validateId(productId);
    if (!validProductId) {
        return { valid: false, error: "Invalid product ID" };
    }

    if (typeof quantity !== "number" || quantity < 0) {
        return {
            valid: false,
            error: "Quantity must be a non-negative number",
        };
    }

    return {
        valid: true,
        data: {
            sessionId: parsedSessionId,
            productId: parsedProductId,
            quantity,
        },
    };
};

export const validateDeleteProductFromSession = (sessionId, productId) => {
    const { valid: validSessionId, id: parsedSessionId } =
        validateId(sessionId);
    if (!validSessionId) {
        return { valid: false, error: "Invalid session ID" };
    }

    const { valid: validProductId, id: parsedProductId } =
        validateId(productId);
    if (!validProductId) {
        return { valid: false, error: "Invalid product ID" };
    }

    return {
        valid: true,
        data: { sessionId: parsedSessionId, productId: parsedProductId },
    };
};
