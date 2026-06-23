import { ENV } from "./env.js";

export const cookiesOptions = {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production", // ✅ best practice
    sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
}