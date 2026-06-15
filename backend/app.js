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
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ FIX 1: cookie parser typo fixed
app.use(cookieParser());

// ================= SECURITY =================
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ================= RATE LIMIT =================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api", limiter);

// ================= CORS =================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://url-shortner-lime-pi.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, true); // dev-safe (important for ngrok)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ❌ FIX 2: REMOVE THIS (CRASH CAUSE)
// app.options("*", cors());

// ================= BODY =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= CUSTOM MIDDLEWARE =================
app.use(attachUser);

// ================= STATIC =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api", short_url);

app.get("/:id", redirectFromShortUrl);

// ================= SERVER =================
const PORT = ENV.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});