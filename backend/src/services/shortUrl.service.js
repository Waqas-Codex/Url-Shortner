import { saveShortUrl, getShortUrl, getCustomShortUrl, getUrlsByUser , deleteUrlById } from "../dao/shortUrl.js";
import { generateNanoId } from "../utils/helper.js";

export const createShortUrlService = async (url, userId = null, slug = null) => {
  const shortId = slug || generateNanoId(8);

  if (slug) {
    const exist = await getCustomShortUrl(slug);
    if (exist) throw new Error("Custom URL already exists");
  }

  await saveShortUrl(shortId, url, userId);
  return shortId;
};

export const getShortUrlService = async (id) => {
  return await getShortUrl(id); 
};

export const getUserUrlsService = async (userId) => {
  return await getUrlsByUser(userId);
};


// create servie for delete url
export const deleteUrlService = async (id, userId) => {
 return await deleteUrlById(id, userId);
};