import { z } from "zod";

export const dashboardAnalyticsSchema = z.object({
  query: z.object({
    range: z.enum(["24h", "7d", "30d", "all"], {
      errorMap: () => ({ message: "Invalid range. Allowed values: 24h, 7d, 30d, all" })
    }).optional(),
  }).optional(),
});
