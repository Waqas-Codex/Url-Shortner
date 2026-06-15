import { ENV } from "./env.js";

export const cookiesOptions = {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production", // ✅ best practice
    sameSite: 'lax',
    maxAge: 1000 * 60 * 5
}