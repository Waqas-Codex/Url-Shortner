const ListFooter = ({ loading, error, filtered, urls }) => {
  if (loading || error || filtered.length === 0) return null

  return (
    <div className="px-5 py-3 border-t border-gray-200/60 dark:border-gray-700/50 text-xs text-gray-400 dark:text-gray-500">
      Showing {filtered.length} of {urls.length} link{urls.length !== 1 ? 's' : ''}
    </div>
  )
}

export default ListFooter
