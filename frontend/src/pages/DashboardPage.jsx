import { useState, useEffect, useCallback } from 'react'
import { getUserUrls } from '../api/shortUrl.api'
import StatCard from '../components/Dashboard/StatCard'
import UrlRow from '../components/Dashboard/UrlRow'
import EmptyState from '../components/Dashboard/EmptyState'
import Toolbar from '../components/Dashboard/Toolbar'
import UrlsList from '../components/Dashboard/UrlsList'
import ListFooter from '../components/Dashboard/ListFooter'
import { DashboardHeader, Stats } from '../components/Dashboard/DashboardHeader'
import '../components/Dashboard/dashboard.css'

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const DashboardPage = () => {
  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [sortBy, setSortBy] = useState('newest') // newest | most-clicked

  const baseUrl = window.location.origin.includes('5173')
    ? 'http://localhost:3000'
    : window.location.origin

  const fetchUrls = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const data = await getUserUrls()
      console.log('✅ API Response:', data)
      setUrls(data.urls || [])
    } catch (err) {
      console.error('❌ API Error:', {
        status: err?.response?.status,
        message: err?.response?.data?.message,
        fullError: err
      })
      setError(err?.response?.data?.message || 'Failed to load your URLs')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchUrls() }, [fetchUrls])

  const totalClicks = urls.reduce((sum, u) => sum + (u.clicks || 0), 0)

  const filtered = urls
    .filter(u =>
      u.short_url.toLowerCase().includes(search.toLowerCase()) ||
      u.full_url.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'most-clicked') return b.clicks - a.clicks
      return 0 // default: server order (already newest first via sort({ _id: -1 }))
    })

  return (
    <>
      <div className=" max-w-5xl mx-auto px-4  py-28 space-y-8">
        {/* ── Header ─────────────────────────────── */}
        <DashboardHeader 
          onRefresh={() => fetchUrls(true)}
          refreshing={refreshing}
        />

        {/* ── Stat Cards ─────────────────────────── */}
        <Stats urls={urls} totalClicks={totalClicks} />

        {/* ── Table Section ──────────────────────── */}
        <div
          className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md shadow-xl overflow-hidden"
          style={{ animation: 'fadeSlideUp 0.5s ease 0.25s both' }}
        >
          {/* Toolbar */}
          <Toolbar 
            search={search} 
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Content */}
          <div className="p-5">
            <UrlsList 
              loading={loading} 
              error={error} 
              filtered={filtered}
              urls={urls}
              baseUrl={baseUrl}
              onRetry={() => fetchUrls()}
            />
          </div>

          {/* Footer */}
          <ListFooter 
            loading={loading} 
            error={error} 
            filtered={filtered}
            urls={urls}
          />
        </div>
      </div>
    </>
  )
}

export default DashboardPage
