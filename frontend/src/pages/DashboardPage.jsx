import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Link2, MousePointerClick, Users, BarChart2, TrendingUp, TrendingDown } from 'lucide-react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, LineElement, PointElement,
  LinearScale, CategoryScale, Filler, Tooltip
} from 'chart.js'
import { getUserUrls } from '../api/shortUrl.api'
import { getDashboardAnalytics } from '../api/analytics.api'
import { ENV } from '../config/env'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)

const RANGES = [
  { key: '24h', label: '24h' },
  { key: '7d', label: '7d' },
  { key: '30d', label: '30d' },
]

const DashboardPage = () => {
  const [urls, setUrls] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [range, setRange] = useState('7d')

  const baseUrl = (ENV.APP_URL || window.location.origin).replace(/\/+$/, '');

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const [urlsData, analyticsData] = await Promise.all([
        getUserUrls(),
        getDashboardAnalytics(range),
      ])
      setUrls(urlsData.urls || [])
      setAnalytics(analyticsData)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [range])

  useEffect(() => { fetchData() }, [fetchData])

  const totalClicks = urls.reduce((sum, u) => sum + (u.clicks || 0), 0)
  const avgClicks = urls.length ? Math.round(totalClicks / urls.length) : 0

  const metrics = [
    { label: 'Total links', value: urls.length, icon: Link2 },
    { label: 'Total clicks', value: totalClicks.toLocaleString(), icon: MousePointerClick, trend: analytics?.clickTrend },
    { label: 'Unique visitors', value: analytics?.uniqueVisitors?.toLocaleString() ?? '—', icon: Users, trend: analytics?.visitorTrend },
    { label: 'Avg clicks/link', value: avgClicks, icon: BarChart2 },
  ]

  const topLinks = [...urls].sort((a, b) => b.clicks - a.clicks).slice(0, 5)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-gray-950">
        <p className="text-sm text-red-500">{error}</p>
        <button onClick={() => fetchData()} className="text-xs text-indigo-500 underline">
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Analytics</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Track performance across all your links
            </p>
          </div>
          <button
            onClick={() => fetchData(true)}
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

        {/* Range selector */}
        <div className="flex justify-end">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
            {RANGES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setRange(key)}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors
                  ${range === key
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {metrics.map(({ label, value, icon: Icon, trend }) => (
            <div key={label} className="bg-gray-100 dark:bg-gray-900 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">{value}</div>
              {trend != null && (
                <div className={`flex items-center gap-1 text-xs mt-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(trend)}%
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Clicks over time */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Clicks over time</h3>
          <div className="relative h-56">
            <Line
              data={{
                labels: analytics?.timeseries?.map(d => d.label) || [],
                datasets: [{
                  data: analytics?.timeseries?.map(d => d.clicks) || [],
                  borderColor: '#6366f1',
                  backgroundColor: 'rgba(99,102,241,0.08)',
                  fill: true,
                  tension: 0.35,
                  pointRadius: 3,
                  pointBackgroundColor: '#6366f1',
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        {/* Devices + Referrers */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Devices</h3>
            <div className="space-y-2.5">
              {(analytics?.devices || []).map(({ label, pct }) => (
                <BarRow key={label} label={label} pct={pct} />
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Top referrers</h3>
            <div className="space-y-2.5">
              {(analytics?.referrers || []).map(({ label, pct }) => (
                <BarRow key={label} label={label} pct={pct} />
              ))}
            </div>
          </div>
        </div>

        {/* Top links */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Top performing links</h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {topLinks.map(link => (
              <div key={link._id} className="flex items-center justify-between py-2.5">
                <span className="text-sm font-medium text-indigo-500">
                  {baseUrl}/{link.short_url}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {link.clicks.toLocaleString()} clicks
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

const BarRow = ({ label, pct }) => (
  <div className="flex items-center gap-2.5">
    <span className="text-xs text-gray-500 dark:text-gray-400 w-20 shrink-0 truncate">{label}</span>
    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
    </div>
    <span className="text-xs text-gray-700 dark:text-gray-300 w-8 text-right">{pct}%</span>
  </div>
)

export default DashboardPage