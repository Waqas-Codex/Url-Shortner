import { Link } from '@tanstack/react-router'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { logout } from '../store/slices/authSlice'
import { logoutUser } from '../api/user.api'

const NAV_LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/urls', label: 'Urls' },
]

const MENU_ITEMS = [
  { to: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Profile' },
  { to: '/dashboard', label: 'Dashboard', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
  { to: '/urls', label: 'Urls', icon: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71m-4.24 4.25a5 5 0 00-7.07 7.07 5 5 0 007.07 0l1.72-1.71' },
  { to: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'Settings' },
]

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const mobileMenuRef = useRef(null)

  const handleLogout = async () => {
    try {
      await logoutUser()
      dispatch(logout())
    } catch (err) {
      console.error('Logout error:', err)
      dispatch(logout())
    }
    setDropdownOpen(false)
    setMobileMenuOpen(false)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const username = user?.username || user?.email?.split('@')[0] || 'user'
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <>
      <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200/50 bg-white/40 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:bg-gray-900/40 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2.5">

          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 transition-transform hover:scale-105 flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">shortner</span>
          </Link>

          {/* Center Nav Pills — hidden on mobile */}
          <div className="hidden md:flex gap-1 items-center bg-white/20 dark:bg-gray-800/20 p-1 rounded-full border border-white/30">
            {NAV_LINKS.map(({ to, label, exact }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact }}
                className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-1.5 rounded-full transition-colors hover:text-gray-800 dark:hover:text-gray-100"
                activeProps={{
                  className: 'text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full border border-gray-200/60 dark:border-gray-700'
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Auth section */}
            {isAuthenticated && user ? (
              <div className="relative" ref={menuRef}>
                {/* Trigger Button */}
                <button
                  onClick={() => setDropdownOpen(p => !p)}
                  aria-expanded={dropdownOpen}
                  aria-label="User menu"
                  className={`flex items-center gap-2 border rounded-full px-2.5 py-1.5 transition-all
                    ${dropdownOpen
                      ? 'bg-white/30 dark:bg-gray-700/40 border-gray-300/60 dark:border-gray-600'
                      : 'bg-transparent border-gray-200/60 dark:border-gray-700 hover:bg-white/20 dark:hover:bg-gray-800/40'
                    }`}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-7 h-7 rounded-full" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
                      {initials}
                    </div>
                  )}
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-100 leading-tight">{user.name}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">@{username}</span>
                  </div>
                  <svg
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ml-0.5 ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                <div className={`absolute right-0 mt-1.5 w-56 bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl overflow-hidden z-50 origin-top-right transition-all duration-150
                  ${dropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}`}
                >
                  {/* Header */}
                  <div className="px-3.5 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2.5">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-9 h-9 rounded-full" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full mt-0.5">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        Free plan
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-1.5">
                    {MENU_ITEMS.map(({ to, icon, label, badge }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 rounded-xl transition-colors"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={icon} />
                        </svg>
                        <span className="flex-1">{label}</span>
                        {badge && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            {badge}
                          </span>
                        )}
                      </Link>
                    ))}

                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-500 rounded-full hover:bg-indigo-600 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileMenuOpen(p => !p)}
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-gray-800/40 transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Nav Menu */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out border-t border-gray-200/50 dark:border-gray-700/50
            ${mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="px-4 py-3 flex flex-col gap-1 bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg">
            {NAV_LINKS.map(({ to, label, exact }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact }}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                activeProps={{
                  className: 'flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Navbar