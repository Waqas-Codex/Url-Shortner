import { LoadingSpinner, ErrorIcon } from './icons.jsx'
import UrlRow from './UrlRow'
import EmptyState from './EmptyState'

const UrlsList = ({ loading, error, filtered, baseUrl, onRetry }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <LoadingSpinner />
        <p className="text-sm text-gray-400 dark:text-gray-500">Loading your links…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <ErrorIcon />
        </div>
        <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={onRetry}
          className="text-xs text-indigo-600 dark:text-indigo-400 underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (filtered.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-3">
      {filtered.map((entry, i) => (
        <UrlRow key={entry._id} entry={entry} index={i} baseUrl={baseUrl} />
      ))}
    </div>
  )
}

export default UrlsList
