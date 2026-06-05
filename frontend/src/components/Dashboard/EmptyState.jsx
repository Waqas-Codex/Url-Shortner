import { LinkIcon } from './icons.jsx'

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center">
      <LinkIcon />
    </div>
    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">No links yet</h3>
    <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs">
      Go to the Home page and shorten your first URL — it will appear here with click analytics.
    </p>
  </div>
)

export default EmptyState
