import { useState } from 'react'
import { ClickIcon, CopyIcon, CheckIcon, ExternalLinkIcon } from './icons.jsx'

const UrlRow = ({ entry, index, baseUrl }) => {
  const [copied, setCopied] = useState(false)
  const shortLink = `${baseUrl}/${entry.short_url}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shortLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // derive a simple domain label for the original url
  let originDomain = entry.full_url
  try { originDomain = new URL(entry.full_url).hostname } catch {
    // ignore error, use full URL as fallback
  }

  // clicks bar – max out at 100 for visual purposes
  const barWidth = Math.min((entry.clicks / Math.max(entry.clicks, 10)) * 100, 100)

  return (
    <div
      className="group relative flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border border-white/20 dark:border-white/10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-xl transition-all duration-300"
      style={{ animation: `fadeSlideUp 0.4s ease ${0.05 * index}s both` }}
    >
      {/* Index badge */}
      <span className="hidden sm:flex w-7 h-7 shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold items-center justify-center">
        {index + 1}
      </span>

      {/* URLs column */}
      <div className="flex-1 min-w-0 space-y-1">
        {/* Short URL */}
        <div className="flex items-center gap-2">
          <a
            href={shortLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline truncate"
          >
            {shortLink}
          </a>
          <ExternalLinkIcon />
        </div>
        {/* Original URL */}
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate" title={entry.full_url}>
          → {originDomain}
        </p>
      </div>

      {/* Clicks */}
      <div className="flex flex-col items-start sm:items-center gap-1 sm:min-w-25">
        <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200">
          <ClickIcon />
          <span className="text-lg font-bold">{entry.clicks.toLocaleString()}</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden sm:w-24">
          <div
            className="h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all duration-700"
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <span className="text-xs text-gray-400">clicks</span>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        id={`copy-btn-${index}`}
        title="Copy short link"
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
          copied
            ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50'
        }`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}

export default UrlRow
