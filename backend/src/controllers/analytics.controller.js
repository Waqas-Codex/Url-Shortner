// controllers/analytics.controller.js

import { getDashboardAnalyticsService } from "../services/analytics.service.js";

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { range = "7d" } = req.query;

    const analytics = await getDashboardAnalyticsService(
      userId,
      range
    );

    return res.status(200).json(analytics);
  } catch (error) {
    next(error);
  }
};