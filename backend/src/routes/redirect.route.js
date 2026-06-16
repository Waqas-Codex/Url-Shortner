import express from 'express'
import Url from '../models/shorturl.model.js'
import { isBot } from '../middlewares/botDetector.middleware.js'

const router = express()

router.get('/:slug', async (req, res) => {
  const url = await Url.findOne({ short_url: req.params.slug })
  if (!url) return res.status(404).send('Not found')

  const userAgent = req.headers['user-agent'] || ''
  console.log('--- Incoming request ---')
  console.log('UA:', userAgent)
  console.log('isBot result:', isBot(userAgent))

  if (isBot(userAgent)) {
    console.log('Serving OG tags page')
    return res.send(`...`)
  }

  console.log('Redirecting to:', url.full_url)
  url.clicks += 1
  await url.save()
  return res.redirect(url.full_url)
})

export default router