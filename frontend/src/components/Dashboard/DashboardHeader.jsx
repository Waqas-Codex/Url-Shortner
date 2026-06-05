import { LinkIcon, ClickIcon, RefreshIcon } from './icons.jsx'
import StatCard from './StatCard'

const DashboardHeader = ({ onRefresh, refreshing }) => (
  <div 
    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    style={{ animation: 'fadeSlideUp 0.4s ease both' }}
  >
    <div>
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
        My Dashboard
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Track all your shortened URLs and their performance.
      </p>
    </div>
    <button
      id="refresh-urls-btn"
      onClick={onRefresh}
      disabled={refreshing}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/70 dark:bg-gray-800/70 border border-white/30 dark:border-gray-700/50 shadow hover:shadow-md text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all disabled:opacity-50"
    >
      <span className={refreshing ? 'spin' : ''}><RefreshIcon /></span>
      Refresh
    </button>
  </div>
)

const Stats = ({ urls, totalClicks }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <StatCard
      icon={<LinkIcon />}
      label="Total Links"
      value={urls.length}
      gradient="from-indigo-500 to-purple-500"
      delay={0.1}
    />
    <StatCard
      icon={<ClickIcon />}
      label="Total Clicks"
      value={totalClicks.toLocaleString()}
      gradient="from-purple-500 to-pink-500"
      delay={0.2}
    />
  </div>
)

export { DashboardHeader, Stats }
