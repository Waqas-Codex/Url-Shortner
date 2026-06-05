import { useState } from "react";
import { useSelector } from "react-redux";
import UrlForm from "../components/UrlForm";
import { createShortUrl } from "../api/shortUrl.api.js";

export default function Home() {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
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

  return (
    <>
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-28px) scale(1.04); }
        }
        @keyframes float-mid {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(20px) scale(0.97); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.35); }
          70%  { box-shadow: 0 0 0 14px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        .orb-1 { animation: float-slow 7s ease-in-out infinite; }
        .orb-2 { animation: float-mid  9s ease-in-out infinite; }
        .orb-3 { animation: float-slow 11s ease-in-out infinite 2s; }
        .fade-up { animation: fade-up 0.6s ease both; }
        .fade-up-1 { animation: fade-up 0.6s ease 0.1s both; }
        .fade-up-2 { animation: fade-up 0.6s ease 0.2s both; }
        .fade-up-3 { animation: fade-up 0.6s ease 0.3s both; }
        .fade-up-4 { animation: fade-up 0.6s ease 0.4s both; }
        .result-slide { animation: slide-in 0.45s cubic-bezier(.34,1.56,.64,1) both; }
        .pulse-btn { animation: pulse-ring 2s ease-out infinite; }
        .spin-loader { animation: spin-slow 0.9s linear infinite; }
      `}</style>

      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-16
                      bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50
                      dark:from-gray-950 dark:via-indigo-950 dark:to-gray-900">

        {/* ── Decorative orbs ───────────────────────────────────── */}
        <div className="pointer-events-none select-none absolute inset-0 overflow-hidden">
          <div className="orb-1 absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full
                          bg-gradient-to-br from-indigo-400/25 to-purple-500/20 blur-3xl" />
          <div className="orb-2 absolute -bottom-40 -right-20 w-[420px] h-[420px] rounded-full
                          bg-gradient-to-br from-purple-500/20 to-pink-400/20 blur-3xl" />
          <div className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[350px] h-[350px] rounded-full
                          bg-gradient-to-br from-indigo-300/10 to-cyan-300/10 blur-2xl" />
          {/* Grid texture */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* ── Hero text ─────────────────────────────────────────── */}
        <div className="relative z-10 text-center mb-10 max-w-2xl">
          {/* Badge */}
          <div className="fade-up inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full
                          bg-indigo-100/80 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700
                          text-xs font-semibold text-indigo-600 dark:text-indigo-300 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Fast · Free · Powerful URL Shortener
          </div>

          <h1 className="fade-up-1 text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight
                         text-gray-900 dark:text-white">
            Shorten any link{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              instantly
            </span>
          </h1>
          <p className="fade-up-2 mt-4 text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
            Turn long, ugly URLs into clean, shareable links in one click.
            {isAuthenticated && " Use a custom slug to personalize your links."}
          </p>
        </div>

        {/* ── Card ──────────────────────────────────────────────── */}
        <div className="fade-up-3 relative z-10 w-full max-w-xl">
          <div className="relative rounded-3xl p-7 sm:p-9
                          bg-white/70 dark:bg-gray-900/70
                          border border-white/50 dark:border-white/10
                          backdrop-blur-xl shadow-[0_8px_60px_rgba(99,102,241,0.15)]">

            {/* Corner glow */}
            <div className="absolute -top-px -right-px w-40 h-40 rounded-3xl
                            bg-gradient-to-bl from-indigo-400/20 to-transparent pointer-events-none" />

            <UrlForm
              url={url}
              setUrl={setUrl}
              loading={loading}
              handleSubmit={handleSubmit}
              isAuthenticated={isAuthenticated}
              customSlug={customSlug}
              setCustomSlug={setCustomSlug}
            />

            {/* Error */}
            {error && (
              <div className="result-slide mt-5 flex items-start gap-3 p-4 rounded-2xl
                              bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            {/* Result */}
            {shortUrl && (
              <div className="result-slide mt-5 rounded-2xl overflow-hidden
                              border border-indigo-200 dark:border-indigo-800
                              bg-gradient-to-br from-indigo-50 to-purple-50
                              dark:from-indigo-950/60 dark:to-purple-950/60">
                <div className="px-5 py-3 flex items-center gap-2 border-b border-indigo-100 dark:border-indigo-800/60">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-widest">
                    Your short link is ready!
                  </p>
                </div>
                <div className="p-4 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-sm font-bold text-indigo-600 dark:text-indigo-300
                               hover:text-indigo-800 dark:hover:text-indigo-100
                               break-all transition-colors hover:underline text-center sm:text-left"
                  >
                    {shortUrl}
                  </a>
                  <button
                    onClick={handleCopy}
                    id="copy-short-url-btn"
                    className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
                                transition-all duration-200 cursor-pointer
                                ${copied
                                  ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                                  : "pulse-btn bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:scale-105"
                                }`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Feature pills ─────────────────────────────────────── */}
        <div className="fade-up-4 relative z-10 mt-10 flex flex-wrap justify-center gap-3">
          {[
            { icon: "⚡", label: "Lightning fast" },
            { icon: "🔒", label: "Secure links" },
            { icon: "📊", label: "Click analytics" },
            { icon: "✏️", label: "Custom slugs" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full
                         bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm
                         border border-white/40 dark:border-gray-700/50
                         text-xs font-semibold text-gray-600 dark:text-gray-300
                         shadow-sm select-none"
            >
              <span>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
