import prisma from "../config/prisma.js";

// CREATE
export const saveShortUrl = async (shortUrl, longUrl, userId) => {
  return await prisma.shortUrl.create({
    data: {
      full_url: longUrl,
      short_url: shortUrl,
      userId: userId || null
    }
  });
};

export const getShortUrl = async (shortUrl) => {
  try {
    return await prisma.shortUrl.update({
      where: { short_url: shortUrl },
      data: { clicks: { increment: 1 } }
    });
  } catch (error) {
    // If not found, prisma throws P2025. Returning null or handling it:
    return null;
  }
};

export const getCustomShortUrl = async (slug) => {
  return await prisma.shortUrl.findUnique({ where: { short_url: slug } });
};

export const getUrlsByUser = async (userId) => {
  return await prisma.shortUrl.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};

export const deleteUrlById = async (id, userId) => {
  // Use deleteMany to safely delete if it belongs to user
  const result = await prisma.shortUrl.deleteMany({
    where: { 
      id: id,
      userId: userId 
    }
  });
  return result;
};