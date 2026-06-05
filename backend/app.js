import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./src/config/db.js";
import short_url from "./src/routes/shortUrl.route.js";
import authRoutes from "./src/routes/auth.routes.js";

import { redirectFromShortUrl } from "./src/controllers/shortUrl.controller.js";
import { attachUser } from "./src/utils/attachUser.js";
import cookeParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cookeParser());

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:5173", // Vite frontend
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(attachUser)

// Expose uploads publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
/**
 * @route   POST /api/create
 * @desc    Create a short URL
 */
/**
 * @route   GET /api/auth
 * @desc    Auth route
 */
app.use("/api/auth", authRoutes);
app.use("/api", short_url);


// redirect route
app.get("/:id", redirectFromShortUrl);

// ✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running at http://localhost:${PORT}`);
});