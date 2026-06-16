import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Link2, ArrowRight, Copy, Check,
  AlertCircle, Zap, Lock, BarChart2, Pencil, Download, QrCode, RefreshCw
} from "lucide-react";
import { createShortUrl, getQrCode } from "../api/shortUrl.api.js"; // 🔥 Imported getQrCode

export default function Home() {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [slugForQr, setSlugForQr] = useState(""); // 🔥 QR fetch karne ke liye temporary slug state
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrLoading, setQrLoading] = useState(false); // 🔥 QR Loader
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false); 
  const [error, setError] = useState("");

  const isAuthenticated = useSelector(
    (state) => state?.auth?.isAuthenticated || false
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setShortUrl("");
    setQr("");
    setSlugForQr("");
    setShowQr(false); 

    try {
      const data = await createShortUrl(url, customSlug);
      
      // Kuch APIs direct shortUrl property deti hain aur kuch objects
      const shortUrlResult = data?.shortUrl || data?.data?.shortUrl;
      setShortUrl(shortUrlResult);

      // Extract unique slug code from URL for QR fetching backup
      if (shortUrlResult) {
        const parts = shortUrlResult.split("/");
        const slug = parts[parts.length - 1];
        setSlugForQr(slug);
      }

      // Agar direct response me qr hai toh set karo, nahi toh dashboard ki tarah dynamically fetch hoga
      if (data?.qr || data?.data?.qr) {
        setQr(data.qr || data.data.qr);
      }

      setUrl("");
      setCustomSlug("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Working dynamic QR Fetch Toggle
  const handleToggleQr = async () => {
    const nextShowState = !showQr;
    setShowQr(nextShowState);

    // Agar QR code pehle se nahi hai aur hamare paas slug moujood hai
    if (nextShowState && !qr && slugForQr) {
      setQrLoading(true);
      try {
        const data = await getQrCode(slugForQr);
        if (data?.qr) {
          setQr(data.qr);
        } else if (data?.data?.qr) {
          setQr(data.data.qr);
        }
      } catch (err) {
        console.error("QR Code load nahi ho saka:", err);
      } finally {
        setQrLoading(false);
      }
    }
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    if (!qr) return;
    const link = document.createElement("a");
    link.href = qr;
    link.download = `qr-${slugForQr || "code"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const features = [
    { icon: Zap, label: "Lightning fast" },
    { icon: Lock, label: "Secure links" },
    { icon: BarChart2, label: "Click analytics" },
    { icon: Pencil, label: "Custom slugs" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 py-20
                    bg-gray-50 dark:bg-gray-950">

      {/* Badge */}
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
                       text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900
                       border border-gray-200 dark:border-gray-800">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
        Fast · Free · Powerful
      </span>

      {/* Hero */}
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white leading-tight">
          Shorten any link{" "}
          <span className="text-indigo-500">instantly</span>
        </h1>
      </div>

      {/* CARD */}
      <div className="w-full max-w-lg bg-white dark:bg-gray-900
                      border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* URL input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your long URL here..."
                required
                className="w-full h-10 pl-9 pr-3 text-sm rounded-lg
                           bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                           border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-10 px-4 flex items-center gap-2 text-sm font-medium text-white
                         bg-indigo-500 hover:bg-indigo-600 rounded-lg disabled:opacity-50 transition-colors"
            >
              {loading ? <span className="animate-pulse">...</span> : <ArrowRight className="w-4 h-4" />}
              Shorten
            </button>
          </div>

          {/* Custom Slug */}
          {isAuthenticated && (
            <input
              type="text"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="custom slug (optional)"
              className="w-full h-9 px-3 text-sm rounded-lg
                         bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                         border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-indigo-500"
            />
          )}
        </form>

        {/* ERROR */}
        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* RESULT */}
        {shortUrl && (
          <div className="mt-4 space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
            
            <div className="flex items-center justify-between gap-3 bg-white dark:bg-gray-900 p-2.5 rounded-md border border-gray-200 dark:border-gray-800">
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-500 text-sm break-all font-medium hover:underline"
              >
                {shortUrl}
              </a>
              
              <div className="flex items-center gap-1 shrink-0">
                {/* QR Code Action Button */}
                <button
                  onClick={handleToggleQr}
                  className={`p-1.5 rounded-md transition-colors ${
                    showQr 
                      ? "bg-indigo-50 text-indigo-500 dark:bg-indigo-950/50" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                  }`}
                  title="Toggle QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </button>
              </div>
            </div>

            {/* QR CODE DISPLAY BOX */}
            {showQr && (
              <div className="flex flex-col items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                {qrLoading ? (
                  <div className="flex items-center gap-2 py-4 text-sm text-gray-500">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                    Generating QR Code...
                  </div>
                ) : qr ? (
                  <>
                    <img
                      src={qr}
                      alt="QR Code"
                      className="w-36 h-36 bg-white p-2 rounded-lg shadow-sm border"
                    />
                    <button
                      onClick={handleDownloadQr}
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-500 font-medium hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download QR Code
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-red-500 py-2">QR Code data structure unavailable.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FEATURES GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-lg mt-2">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div key={index} className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
              <IconComponent className="w-5 h-5 text-indigo-500 mb-1.5" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{feature.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}