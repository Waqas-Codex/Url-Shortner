// services/analytics.service.js
import {
  getUserUrlIds,
  getClicksByUrlIds,
} from "../dao/analytics.dao.js";

export const getDashboardAnalyticsService = async (
  userId,
  range = "7d"
) => {
  const days = range === "24h" ? 1 : range === "30d" ? 30 : 7;

  const since = new Date(
    Date.now() - days * 24 * 60 * 60 * 1000
  );

  const urlIds = await getUserUrlIds(userId);

  if (!urlIds.length) {
    return {
      uniqueVisitors: 0,
      timeseries: [],
      devices: [],
      referrers: [],
    };
  }

  const clicks = await getClicksByUrlIds(urlIds, since);

  const byDate = {};
  const byDevice = {};
  const byReferrer = {};
  const uniqueIPs = new Set();

  clicks.forEach((click) => {
    const day = click.createdAt.toISOString().split("T")[0];

    byDate[day] = (byDate[day] || 0) + 1;
    byDevice[click.device] = (byDevice[click.device] || 0) + 1;
    byReferrer[click.referrer] =
      (byReferrer[click.referrer] || 0) + 1;

    if (click.ip) uniqueIPs.add(click.ip);
  });

  const toPercentArray = (obj) => {
    const total = Object.values(obj).reduce(
      (sum, value) => sum + value,
      0
    );

    return Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({
        label,
        pct: total
          ? Math.round((count / total) * 100)
          : 0,
      }));
  };

  return {
    uniqueVisitors: uniqueIPs.size,
    timeseries: Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, clicks]) => ({
        label,
        clicks,
      })),
    devices: toPercentArray(byDevice),
    referrers: toPercentArray(byReferrer),
  };
};