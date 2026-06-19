import express from "express";
import { register, login , getCurrentUser, updateProfile } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema, updateProfileSchema } from "../validators/auth.validator.js";
import { ENV } from "../config/env.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

// Step 2 — Google callback, JWT banao, cookie set karo
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${ENV.FRONTEND_URL}/auth?error=oauth_failed`,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      ENV.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Frontend pe redirect karo
    res.redirect(`${ENV.FRONTEND_URL}/dashboard`);
  }
);

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.get('/me', authMiddleware, getCurrentUser);

router.put('/profile', authMiddleware, upload.single('avatar'), validate(updateProfileSchema), updateProfile);

router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;