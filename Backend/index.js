import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import protectRoutes from "./middleware/protectRoutes.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import branchRoutes from "./routes/branch.routes.js";
import productRoutes from "./routes/product.routes.js";
import setup from "./setup.js";
import sessionItemsRoutes from "./routes/sessionItems.routes.js";
import branchItemsRoutes from "./routes/branchItems.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

if (!process.env.PORT || !process.env.CORS_ORIGIN) {
    console.error("❌ Missing required environment variables.");
    process.exit(1); // Stop the app from running
}

// --- Express App Setup ---
const app = express();
// --- Middleware Setup ---
app.use(cookieParser());
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses incoming URL-encoded requests

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
        allowedHeaders: ["Content-Type", "Authorization"], // Allowed request headers
        credentials: true, // Allow cookies/authorization headers to be sent
    })
);

// this middleware logs incoming requests
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the API. Please use the appropriate endpoints.",
    });
});

app.use("/api/v2/auth", authRoutes);

app.use(protectRoutes);

// --- Protected Routes ---
app.use("/api/v2/users", userRoutes);
app.use("/api/v2/sessions", sessionRoutes);
app.use("/api/v2/sessions/:sessionId/items", sessionItemsRoutes);
app.use("/api/v2/branches", branchRoutes);
app.use("/api/v2/branches/:branchId/products", branchItemsRoutes);
app.use("/api/v2/products", productRoutes);

// Catch-all 404 route (must be last)
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: "The requested API endpoint does not exist.",
    });
});

// --- Server Start ---
app.listen(process.env.PORT, () => {
    console.log(
        `Server is running on http://${process.env.HOST}:${process.env.PORT}`
    );
    setup()
        .then(() => {
            console.log("✅ Database is ready.");
        })
        .catch((err) => {
            console.error("❌ Setup failed:", err);
        });
});
