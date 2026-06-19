import {
  createShortUrlService,
  getShortUrlService,
  getUserUrlsService,
  deleteUrlService
} from "../services/shortUrl.service.js";
import prisma from "../config/prisma.js";
import { isBot } from "../utils/botDetector.js"; 
import { UAParser } from "ua-parser-js";


export const createShortUrl = async (req, res) => {
  try {
    const data = req.body;
    const shortUrl = await createShortUrlService(
      data.url,
      req.user ? req.user.id : null,
      data.customSlug
    );
    return res.json({
      shortUrl: `${req.protocol}://${req.get("host")}/${shortUrl}`,
    });
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const redirectFromShortUrl = async (req, res) => {
  const { id } = req.params;

  const data = await prisma.shortUrl.findUnique({ where: { short_url: id } });
  if (!data) return res.status(404).send("URL not found");

  const userAgent = req.headers["user-agent"] || "";

  if (isBot(userAgent)) {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="og:title" content="${data.title || "Check this out"}" />
          <meta property="og:description" content="${data.description || "Shortened link via shortner.app"}" />
          <meta property="og:image" content="${data.previewImage || "https://res.cloudinary.com/dmkcml2mw/image/upload/v1781523342/DtE-u4iU8AANEdN_yphxo7.jpg"}" />
          <meta property="og:url" content="${req.protocol}://${req.get("host")}/${id}" />
          <meta property="og:type" content="website" />
          <title>${data.title || "Check this out"}</title>
        </head>
        <body>
          <a href="${data.full_url}">Click here to continue</a>
        </body>
      </html>
    `);
  }

  const parser = new UAParser(userAgent);
  const device = parser.getDevice().type || "desktop";

  prisma.click.create({
    data: {
      urlId: data.id,
      device,
      browser: parser.getBrowser().name,
      referrer: req.headers["referer"] || "direct",
      ip: req.ip,
      country: req.headers["cf-ipcountry"] || "unknown",
    },
  }).catch(err => console.error("Click log failed:", err));

  await prisma.shortUrl.update({
    where: { id: data.id },
    data: { clicks: { increment: 1 } },
  });

  return res.redirect(data.full_url);
};

export const createCustomShortUrl = async (req, res) => {
  const { url, slug } = req.body;

  if (!url || !slug) {
    return res.status(400).json({ message: "URL and slug are required" });
  }

  const shortUrl = await createShortUrlService(
    url, 
    req.user ? req.user.id : null, 
    slug
  );

  return res.json({
    shortUrl: `${req.protocol}://${req.get("host")}/${shortUrl}`,
  });
};

export const getUserUrls = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const urls = await getUserUrlsService(req.user.id);
    return res.json({ urls });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUrl = await deleteUrlService(id, req.user.id);

    if (!deletedUrl) {
      return res.status(404).json({
        message: "URL not found or you don't have permission to delete it",
      });
    }

    return res.json({
      message: "URL deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};