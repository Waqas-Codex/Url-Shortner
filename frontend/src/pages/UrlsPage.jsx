import { useState, useEffect, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { getUserUrls, deleteUrl } from '../api/shortUrl.api'
import Toolbar from '../components/Dashboard/Toolbar'
import UrlsList from '../components/Dashboard/UrlsList'
import ListFooter from '../components/Dashboard/ListFooter'
import { ENV } from '../config/env'

const UrlsPage = () => {
  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [deletingId, setDeletingId] = useState(null)

  const baseUrl = (ENV.APP_URL || window.location.origin).replace(/\/+$/, '');

  const fetchUrls = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const data = await getUserUrls()
      setUrls(data.urls || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load your URLs')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchUrls() }, [fetchUrls])

  const handleDelete = useCallback(async (id) => {
    setDeletingId(id)
    try {
      await deleteUrl(id)
      setUrls(prev => prev.filter(u => u.id !== id))
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setDeletingId(null)
    }
  }, [])

  const filtered = urls
    .filter(u =>
      u.short_url.toLowerCase().includes(search.toLowerCase()) ||
      u.full_url.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => sortBy === 'most-clicked' ? b.clicks - a.clicks : 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Your URLs</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage all your shortened links
            </p>
          </div>
          <button
            onClick={() => fetchUrls(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium
                       text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900
                       border border-gray-200 dark:border-gray-800 rounded-lg
                       hover:border-gray-300 dark:hover:border-gray-700
                       transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Table card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
          <Toolbar
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <UrlsList
            loading={loading}
            error={error}
            filtered={filtered}
            urls={urls}
            baseUrl={baseUrl}
            onRetry={() => fetchUrls()}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
          <ListFooter
            loading={loading}
            error={error}
            filtered={filtered}
            urls={urls}
          />
        </div>

      </div>
    </div>
  )
}

export default UrlsPage
