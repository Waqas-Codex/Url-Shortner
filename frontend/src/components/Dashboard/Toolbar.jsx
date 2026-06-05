import { SearchIcon } from './icons.jsx'

const Toolbar = ({ search, onSearchChange, sortBy, onSortChange }) => (
  <div className="flex flex-col sm:flex-row gap-3 p-5 border-b border-gray-200/60 dark:border-gray-700/50">
    {/* Search */}
    <div className="relative flex-1">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <SearchIcon />
      </div>
      <input
        id="search-urls-input"
        type="text"
        placeholder="Search by short or original URL…"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/50 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />
    </div>
    {/* Sort */}
    <select
      id="sort-urls-select"
      value={sortBy}
      onChange={e => onSortChange(e.target.value)}
      className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/50 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
    >
      <option value="newest">Newest first</option>
      <option value="most-clicked">Most clicked</option>
    </select>
  </div>
)

export default Toolbar
