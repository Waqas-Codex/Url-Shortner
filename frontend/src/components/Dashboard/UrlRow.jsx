import { useState } from 'react'
import { Copy, Check, ExternalLink, MousePointerClick, Trash2, RefreshCw } from 'lucide-react'

const UrlRow = ({ entry, baseUrl, onDelete, isDeleting }) => {
  const [copied, setCopied] = useState(false)
  const shortLink = `${baseUrl}/${entry.short_url}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shortLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  let originDomain = entry.full_url
  try { originDomain = new URL(entry.full_url).hostname } catch {
      // in case of invalid URL, fallback to full URL
      originDomain = entry.full_url
  }

  return (
    <div className="flex items-center gap-4 px-4 py-3.5
                    hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">

      {/* URLs */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-1.5">
          <a
          
            href={shortLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-indigo-500 dark:text-indigo-400
                       hover:underline truncate"
          >
            {shortLink}
          </a>
          <ExternalLink className="w-3 h-3 text-gray-300 dark:text-gray-600 shrink-0" />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate" title={entry.full_url}>
          {originDomain}
        </p>
      </div>

      {/* Clicks */}
      <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 shrink-0">
        <MousePointerClick className="w-3.5 h-3.5" />
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {entry.clicks.toLocaleString()}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleCopy}
          title="Copy short link"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors
            ${copied
              ? 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700'
            }`}
        >
          {copied
            ? <><Check className="w-3.5 h-3.5" /> Copied</>
            : <><Copy className="w-3.5 h-3.5" /> Copy</>
          }
        </button>

        <button
          onClick={() => onDelete(entry._id)}
          disabled={isDeleting}
          title="Delete"
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500
                     hover:bg-red-50 dark:hover:bg-red-950/40
                     transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isDeleting
            ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            : <Trash2 className="w-3.5 h-3.5" />
          }
        </button>
      </div>

    </div>
  )
}

export default UrlRow