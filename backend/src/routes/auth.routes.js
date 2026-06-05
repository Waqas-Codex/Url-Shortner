import express from "express";
import { register, login , getCurrentUser, updateProfile } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";


const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get('/me', authMiddleware, getCurrentUser);

router.put('/profile', authMiddleware, upload.single('avatar'), updateProfile);

router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;