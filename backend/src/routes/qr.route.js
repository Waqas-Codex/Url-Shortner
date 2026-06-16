import express from "express";
import { generateQrCode } from "../controllers/qr.controller.js";

const router = express.Router();

router.get("/:slug", generateQrCode);

export default router;