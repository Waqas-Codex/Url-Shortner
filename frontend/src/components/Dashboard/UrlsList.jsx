import { LoadingSpinner, ErrorIcon } from './icons.jsx'
import UrlRow from './UrlRow'
import EmptyState from './EmptyState'

const UrlsList = ({ loading, error, filtered, baseUrl, onRetry, onDelete, deletingId }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <LoadingSpinner />
        <p className="text-sm text-gray-400 dark:text-gray-500">Loading your links…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
        <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
          <ErrorIcon />
        </div>
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        <button
          onClick={onRetry}
          className="text-xs text-indigo-500 dark:text-indigo-400 underline hover:no-underline"
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
    <div className="divide-y divide-gray-100 dark:divide-gray-800">
      {filtered.map((entry) => (
        <UrlRow
          key={entry.id}
          entry={entry}
          baseUrl={baseUrl}
          onDelete={onDelete}
          isDeleting={deletingId === entry.id}
        />
      ))}
    </div>
  )
}

export default UrlsList