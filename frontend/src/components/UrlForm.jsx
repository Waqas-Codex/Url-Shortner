function UrlForm({ url, setUrl, loading, handleSubmit, isAuthenticated, customSlug, setCustomSlug }) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* URL Input */}
      <div className="space-y-1.5">
        <label htmlFor="url" className="block text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Paste your long URL
        </label>
        <div className="relative group">
          {/* Link icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none transition-colors group-focus-within:text-indigo-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <input
            id="url"
            type="url"
            placeholder="https://very-long-domain.com/path/to/page?query=value"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm
                       bg-gray-50 dark:bg-gray-800/80
                       border-2 border-gray-200 dark:border-gray-700
                       text-gray-800 dark:text-gray-100
                       placeholder-gray-400 dark:placeholder-gray-600
                       transition-all duration-200
                       focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500
                       focus:ring-4 focus:ring-indigo-500/10
                       hover:border-indigo-300 dark:hover:border-indigo-700"
          />
        </div>
      </div>

      {/* Custom Slug — only for authenticated users */}
      {isAuthenticated && (
        <div className="space-y-1.5">
          <label htmlFor="customSlug" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Custom Slug
            <span className="normal-case px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-500 dark:text-indigo-400 text-[10px] font-bold tracking-normal">
              Optional
            </span>
          </label>
          <div className="relative group">
            {/* Hash icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none transition-colors group-focus-within:text-indigo-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <input
              id="customSlug"
              type="text"
              placeholder="e.g., my-awesome-link"
              value={customSlug || ""}
              onChange={(e) => setCustomSlug(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm
                         bg-gray-50 dark:bg-gray-800/80
                         border-2 border-gray-200 dark:border-gray-700
                         text-gray-800 dark:text-gray-100
                         placeholder-gray-400 dark:placeholder-gray-600
                         transition-all duration-200
                         focus:outline-none focus:border-purple-500 dark:focus:border-purple-500
                         focus:ring-4 focus:ring-purple-500/10
                         hover:border-purple-300 dark:hover:border-purple-700"
            />
          </div>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        id="shorten-url-btn"
        disabled={loading}
        className="relative w-full py-3.5 rounded-2xl font-bold text-sm text-white
                   bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                   shadow-lg shadow-indigo-500/30
                   transition-all duration-200
                   hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40
                   active:scale-[0.98]
                   disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none
                   overflow-hidden"
      >
        {/* Shimmer overlay */}
        {!loading && (
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0
                           -translate-x-full hover:translate-x-full transition-transform duration-700" />
        )}

        <span className="relative flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Shortening…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Shorten Link
            </>
          )}
        </span>
      </button>
    </form>
  );
}

export default UrlForm;