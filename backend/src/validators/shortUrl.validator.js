import { z } from "zod";

export const createUrlSchema = z.object({
  body: z.object({
    url: z.string().url("Invalid URL format").min(1, "URL is required"),
    customSlug: z.string().min(3, "Custom slug must be at least 3 characters").max(20, "Custom slug is too long").optional().or(z.literal("")),
  }),
});

export const deleteUrlSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID is required"),
  }),
});
