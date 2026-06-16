import QRCode from "qrcode";
import { getCustomShortUrl } from "../dao/shortUrl.js";

export const generateQrCode = async (req, res) => {
  try {
    const { slug } = req.params;

    // check slug exists or not
    const data = await getCustomShortUrl(slug);

    if (!data) {
      return res.status(404).json({ message: "URL not found" });
    }

    // full short URL
    const fullUrl = `${req.protocol}://${req.get("host")}/${slug}`;

    // generate QR
    const qr = await QRCode.toDataURL(fullUrl);

    return res.json({ qr });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
