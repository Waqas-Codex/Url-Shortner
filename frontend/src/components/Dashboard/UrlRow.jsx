import { useState } from 'react'
import { Copy, Check, ExternalLink, MousePointerClick, Trash2, RefreshCw, QrCode, X, Download } from 'lucide-react'
import { getQrCode } from '../../api/shortUrl.api'

const UrlRow = ({ entry, baseUrl, onDelete, isDeleting }) => {
  const [copied, setCopied] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [qrData, setQrData] = useState(null)
  const [qrLoading, setQrLoading] = useState(false)
  const [qrError, setQrError] = useState(null)
  const shortLink = `${baseUrl}/${entry.short_url}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shortLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShowQr = async () => {
    setShowQr(true)
    if (!qrData) {
      setQrLoading(true)
      setQrError(null)
      try {
        const data = await getQrCode(entry.short_url)
        if (data.qr) {
          setQrData(data.qr)
        } else {
          setQrError("No QR code data received")
        }
      } catch (err) {
        setQrError(err?.response?.data?.message || 'Failed to load QR code')
      } finally {
        setQrLoading(false)
      }
    }
  }

  const closeQrModal = () => {
    setShowQr(false)
  }

  let originDomain = entry.full_url
  try { originDomain = new URL(entry.full_url).hostname } catch {
      // in case of invalid URL, fallback to full URL
      originDomain = entry.full_url
  }

  return (
    <>
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
            onClick={handleShowQr}
            title="Show QR Code"
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500
                       hover:bg-indigo-50 dark:hover:bg-indigo-950/40
                       transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>
          
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
            onClick={() => onDelete(entry.id)}
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

      {/* QR Modal (Using simple overlay) */}
      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">QR Code</h3>
              <button 
                onClick={closeQrModal}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 flex flex-col items-center justify-center min-h-[250px]">
              {qrLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                  <p className="text-sm text-gray-500">Generating QR code...</p>
                </div>
              ) : qrError ? (
                <div className="text-center space-y-2">
                  <p className="text-sm text-red-500">{qrError}</p>
                  <button 
                    onClick={() => { setQrData(null); handleShowQr(); }}
                    className="text-xs text-indigo-500 hover:underline"
                  >
                    Try Again
                  </button>
                </div>
              ) : qrData ? (
                <div className="space-y-4 flex flex-col items-center">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                    <img src={qrData} alt={`QR Code for ${shortLink}`} className="w-48 h-48 rounded" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium break-all text-center">
                    {shortLink}
                  </p>
                  <a 
                    href={qrData}
                    download={`qr-${entry.short_url}.png`}
                    className="flex items-center gap-2 px-4 py-2 mt-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors w-full justify-center"
                  >
                    <Download className="w-4 h-4" />
                    Download QR
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UrlRow