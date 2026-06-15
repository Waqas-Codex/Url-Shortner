import { useState } from "react";
import { useSelector } from "react-redux";
import { Link2, ArrowRight, Copy, Check, AlertCircle, Zap, Lock, BarChart2, Pencil } from "lucide-react";
import { createShortUrl } from "../api/shortUrl.api.js";

export default function Home() {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated || false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError("");
    setShortUrl("");
    try {
      const data = await createShortUrl(url, customSlug);
      setShortUrl(data.shortUrl);
      setUrl("");
      setCustomSlug("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const features = [
    { icon: Zap,      label: "Lightning fast" },
    { icon: Lock,     label: "Secure links"   },
    { icon: BarChart2, label: "Click analytics" },
    { icon: Pencil,   label: "Custom slugs"   },
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
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Turn long, ugly URLs into clean, shareable links in one click.
          {isAuthenticated && " Add a custom slug to make it yours."}
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-white dark:bg-gray-900
                      border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-3">

          {/* URL input + submit */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your long URL here..."
                required
                className="w-full h-10 pl-9 pr-3 text-sm rounded-lg bg-gray-50 dark:bg-gray-800
                           border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white
                           placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/30
                           focus:border-indigo-400 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-10 px-4 flex items-center gap-2 text-sm font-medium text-white
                         bg-indigo-500 hover:bg-indigo-600 active:scale-95
                         rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                </svg>
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              Shorten
            </button>
          </div>

          {/* Custom slug — only for logged-in users */}
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 whitespace-nowrap">shortner.app /</span>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="custom-slug (optional)"
                className="flex-1 h-9 px-3 text-sm rounded-lg bg-gray-50 dark:bg-gray-800
                           border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white
                           placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/30
                           focus:border-indigo-400 transition"
              />
            </div>
          )}
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-start gap-2.5 p-3 rounded-lg
                          bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Result */}
        {shortUrl && (
          <div className="mt-4 flex items-center justify-between gap-3 p-3 rounded-lg
                          bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-indigo-500 hover:text-indigo-600
                         hover:underline truncate transition"
            >
              {shortUrl}
            </a>
            <button
              onClick={handleCopy}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
                          border transition active:scale-95
                          ${copied
                            ? "bg-green-50 border-green-200 text-green-600 dark:bg-green-950/40 dark:border-green-800 dark:text-green-400"
                            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                          }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {features.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-gray-500 dark:text-gray-400
                       bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 select-none"
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}