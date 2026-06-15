import {
  createShortUrlServiceWithoutUser,
  createShortUrlServiceWithUser,
  getShortUrlService,
  getUserUrlsService,
  deleteUrlService
} from "../services/shortUrl.service.js";

export const createShortUrl = async (req, res) => {
  try {
    const data = req.body;
    let shortUrl;

    if (req.user) {
      shortUrl = await createShortUrlServiceWithUser(data.url, req.user._id, data.customSlug);
    } else {
      shortUrl = await createShortUrlServiceWithoutUser(data.url);
    }
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

  const data = await getShortUrlService(id);

  if (!data) {
    return res.status(404).send("URL not found");
  }

  return res.redirect(data.full_url);
};

export const createCustomShortUrl = async (req, res) => {
  const { url, slug } = req.body;

  if (!url || !slug) {
    return res.status(400).json({ message: "URL and slug are required" });
  }

  const shortUrl = await createShortUrlServiceWithoutUser(url, slug);

  return res.json({
    shortUrl: `${req.protocol}://${req.get("host")}/${shortUrl}`,
  });
};

export const getUserUrls = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const urls = await getUserUrlsService(req.user._id);
    return res.json({ urls });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// create delete url  controller

export const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUrl = await deleteUrlService(id, req.user._id);

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