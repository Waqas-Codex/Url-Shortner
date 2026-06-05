import { Link } from '@tanstack/react-router'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { logoutUser } from '../api/user.api'

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      await logoutUser()
      dispatch(logout())
    } catch (err) {
      console.error('Logout error:', err)
      // Still logout locally even if server logout fails
      dispatch(logout())
    }
  }

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200/50 bg-white/40 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:bg-gray-900/40 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 transition-transform hover:scale-105">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            shortner
          </span>
        </Link>

        {/* Center Links */}
        <div className="flex space-x-8 items-center bg-white/20 dark:bg-gray-800/20 px-6 py-2 rounded-full border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
          <Link
            to="/"
            className="text-sm font-semibold text-gray-700 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400"
            activeProps={{ className: 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className="text-sm font-semibold text-gray-700 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400"
            activeProps={{ className: 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' }}
          >
            Dashboard
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {user && (
                <Link to="/profile" className="hidden md:flex items-center space-x-3 bg-white/20 dark:bg-gray-800/20 px-3 py-1.5 rounded-full border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] hover:bg-white/30 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <img 
                    src={user.avatar} 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full border border-indigo-200"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                      @{user.username || (user.email ? user.email.split('@')[0] : 'user')}
                    </span>
                  </div>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-md hover:scale-105 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-md hover:scale-105 transition"
            >
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar