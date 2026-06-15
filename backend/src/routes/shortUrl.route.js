import express from 'express'
import { createShortUrl, getUserUrls , deleteUrl } from '../controllers/shortUrl.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
const router = express.Router()


router.post('/create', createShortUrl)
router.get('/urls', authMiddleware, getUserUrls)

// create delete url route
router.delete('/url/:id', authMiddleware, deleteUrl)


export default router;