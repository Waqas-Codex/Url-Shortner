const BOT_PATTERNS = [
  "facebookexternalhit", "Facebot", "Twitterbot", "WhatsApp",
  "LinkedInBot", "TelegramBot", "Slackbot", "Discordbot"
];

export const isBot = (userAgent = "") =>
  BOT_PATTERNS.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));