import { useState } from "react";
import { QrCode, Copy, Check, Download, RefreshCw } from "lucide-react";
import { getQrCode } from "../api/shortUrl.api.js"; // 🔥 Import for background safety

function UrlForm({
  url,
  setUrl,
  loading,
  handleSubmit,
  isAuthenticated,
  customSlug,
  setCustomSlug
}) {
  const [qr, setQr] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setShortUrl("");
    setQr("");

    try {
      // Parent component (Home) ka function execute hoga jo API hit karega
      const data = await handleSubmit(e);

      // Backend response data check format
      const finalShortUrl = data?.shortUrl || data?.data?.shortUrl;
      const finalQr = data?.qr || data?.data?.qr;

      if (finalShortUrl) {
        setShortUrl(finalShortUrl);
      }

      if (finalQr) {
        setQr(finalQr);
      } else if (finalShortUrl) {
        // 🔥 Fallback: Agar response me qr na aaye, toh short URL se slug nikal kar getQrCode chalayein
        setQrLoading(true);
        const parts = finalShortUrl.split("/");
        const slug = parts[parts.length - 1];
        try {
          const qrRes = await getQrCode(slug);
          if (qrRes?.qr) setQr(qrRes.qr);
        } catch (err) {
          console.log("QR Fetching inside form failed:", err);
        } finally {
          setQrLoading(false);
        }
      }

    } catch (err) {
      console.log("Error inside Form Submit wrapper:", err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">

      {/* URL Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Paste your long URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-2xl text-sm
                     bg-gray-50 dark:bg-gray-800/80
                     border border-gray-300 dark:border-gray-700
                     text-gray-900 dark:text-white focus:outline-none"
        />
      </div>

      {/* Custom Slug */}
      {isAuthenticated && (
        <input
          type="text"
          value={customSlug || ""}
          onChange={(e) => setCustomSlug(e.target.value)}
          placeholder="custom slug (optional)"
          className="w-full px-4 py-3 rounded-2xl text-sm
                     bg-gray-50 dark:bg-gray-800/80
                     border border-gray-300 dark:border-gray-700
                     text-gray-900 dark:text-white focus:outline-none"
        />
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-2xl text-white bg-indigo-500
                   hover:bg-indigo-600 transition font-medium disabled:opacity-50"
      >
        {loading ? "Shortening..." : "Shorten Link"}
      </button>

      {/* RESULT SECTION */}
      {shortUrl && (
        <div className="mt-4 space-y-4 p-4 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          
          <div className="flex items-center justify-between gap-2">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 text-sm break-all hover:underline font-medium"
            >
              {shortUrl}
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg shrink-0 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
            </button>
          </div>

          {/* QR Container code render */}
          <div className="flex flex-col items-center justify-center pt-3 border-t border-gray-200 dark:border-gray-800">
            {qrLoading ? (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                Loading QR code...
              </div>
            ) : qr ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={qr}
                  alt="QR Code"
                  className="w-36 h-36 rounded-lg bg-white p-2 border shadow-sm"
                />
                <a
                  href={qr}
                  download="qrcode.png"
                  className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:underline font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download QR Code
                </a>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </form>
  );
}

export default UrlForm;