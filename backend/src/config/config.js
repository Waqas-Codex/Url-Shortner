
export const cookiesOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ✅ best practice
    sameSite: 'lax',
    maxAge: 1000 * 60 * 5
}