// dao/analytics.dao.js
import prisma from "../config/prisma.js";

export const getUserUrlIds = async (userId) => {
  const userUrls = await prisma.shortUrl.findMany({
    where: { userId },
    select: { id: true },
  });

  return userUrls.map((url) => url.id);
};

export const getClicksByUrlIds = async (urlIds, since) => {
  return prisma.click.findMany({
    where: {
      urlId: { in: urlIds },
      createdAt: { gte: since },
    },
    select: {
      device: true,
      referrer: true,
      ip: true,
      createdAt: true,
    },
  });
};