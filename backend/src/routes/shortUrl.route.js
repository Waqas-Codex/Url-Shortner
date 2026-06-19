import express from 'express'
import { createShortUrl, getUserUrls , deleteUrl } from '../controllers/shortUrl.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createUrlSchema, deleteUrlSchema } from '../validators/shortUrl.validator.js';
const router = express.Router()


router.post('/create', validate(createUrlSchema), createShortUrl)
router.get('/urls', authMiddleware, getUserUrls)

// create delete url route
router.delete('/url/:id', authMiddleware, validate(deleteUrlSchema), deleteUrl)


export default router;