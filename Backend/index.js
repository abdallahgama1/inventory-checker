import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sessionRoutes from "./routes/session.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import protectRoutes from "./middlewares/protect.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.use("/api/v2/auth", authRoutes);

app.use(protectRoutes); // Protect all routes below this middleware
app.use("/api/v2/users", userRoutes);
app.use("/api/v2/products", productRoutes);
app.use("/api/v2/sessions", sessionRoutes);

app.listen(process.env.PORT, () => {
    console.log(
        `Server is running on http://${process.env.HOST}:${process.env.PORT}`
    );
});
