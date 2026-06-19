import express from "express";
import { generateQrCode } from "../controllers/qr.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { getQrSchema } from "../validators/qr.validator.js";

const router = express.Router();

router.get("/:slug", validate(getQrSchema), generateQrCode);

export default router;