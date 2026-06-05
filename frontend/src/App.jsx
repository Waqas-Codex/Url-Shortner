import { Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { login, logout } from './store/slices/authSlice'
import { getCurrentUser } from './api/user.api'
import Navbar from './components/Navbar'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Restore auth state on app load
    const restoreAuthState = async () => {
      try {
        const data = await getCurrentUser()
        if (data?.user) {
          dispatch(login(data.user))
        }
      } catch (err) {
        // User not authenticated, which is fine
        console.log('No active session', err)
        dispatch(logout())
      }
    }

    restoreAuthState()
  }, [dispatch])

  return (
    <main className=' bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200'>
      <Navbar />
      <Outlet />
    </main>
  )
}

export default App