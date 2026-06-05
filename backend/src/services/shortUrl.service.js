import { saveShortUrl, getShortUrl, getCustomShortUrl, getUrlsByUser } from "../dao/shortUrl.js";
import { generateNanoId } from "../utils/helper.js";

export const createShortUrlServiceWithoutUser = async (url, slug = null) => {
  const shortId = slug ||  generateNanoId(8);
  if (slug) {
    const exist = await getCustomShortUrl(slug);
    if (exist) throw new Error("Custom URL already exists");
  }
  await saveShortUrl(shortId, url);
  return shortId;
};



export const createShortUrlServiceWithUser = async (url, userId, slug = null) => {
  const shortUrl = slug || generateNanoId(8);

  if (slug) {
    const exist = await getCustomShortUrl(slug);
    if (exist) throw new Error("Custom URL already exists");
  }

  await saveShortUrl(shortUrl, url, userId);
  return shortUrl;
};

export const getShortUrlService = async (id) => {
  return await getShortUrl(id); 
};

export const getUserUrlsService = async (userId) => {
  return await getUrlsByUser(userId);
};