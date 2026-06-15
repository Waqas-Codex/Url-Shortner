import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import { ENV } from "./src/config/env.js";
import connectDB from "./src/config/db.js";
import short_url from "./src/routes/shortUrl.route.js";
import authRoutes from "./src/routes/auth.routes.js";

import { redirectFromShortUrl } from "./src/controllers/shortUrl.controller.js";
import { attachUser } from "./src/utils/attachUser.js";
import cookeParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cookeParser());

// ✅ Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows static assets like images to be served if needed
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per `window`
  message: "Too many requests from this IP, please try again later."
});
app.use("/api", limiter);

// ✅ Middleware
app.use(cors({
  origin: ENV.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(attachUser)

// Expose uploads publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

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
const PORT = ENV.PORT;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});