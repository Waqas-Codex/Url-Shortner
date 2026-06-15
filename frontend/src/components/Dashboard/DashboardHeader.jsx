// DashboardHeader.jsx — Stats component
import { Link2, MousePointerClick, TrendingUp } from 'lucide-react'

export const Stats = ({ urls, totalClicks }) => {
  const avg = urls.length ? Math.round(totalClicks / urls.length) : 0

  const cards = [
    { label: 'Total links',  value: urls.length, sub: 'All time',         icon: Link2 },
    { label: 'Total clicks', value: totalClicks.toLocaleString(), sub: 'Across all links', icon: MousePointerClick },
    { label: 'Avg. clicks',  value: avg,          sub: 'Per link',         icon: TrendingUp },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map(({ label, value, sub, icon: Icon }) => (
        <div
          key={label}
          className="bg-white dark:bg-gray-900
                     border border-gray-200 dark:border-gray-800
                     rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
            <Icon className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
          </div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
          <div className="text-xs text-gray-400 dark:text-gray-600 mt-1">{sub}</div>
        </div>
      ))}
    </div>
  )
}