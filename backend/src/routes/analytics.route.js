// src/routes/analytics.route.js
import express from "express";
import { getDashboardAnalytics } from "../controllers/analytics.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; // jo bhi tumhara auth middleware naam hai
import { validate } from "../middlewares/validate.middleware.js";
import { dashboardAnalyticsSchema } from "../validators/analytics.validator.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, validate(dashboardAnalyticsSchema), getDashboardAnalytics);

export default router;