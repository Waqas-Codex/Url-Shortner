import { RootRoute, Route, createRouter } from '@tanstack/react-router'
import App from './App'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Dashboard from './pages/DashboardPage'
import Profile from './pages/Profile'
import UrlsPage from './pages/UrlsPage'
import { checkAuth } from './utils/helper'

// Root route
const rootRoute = new RootRoute({
  component: App,
})

// Home route
const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

// Auth route
const authRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: Auth,
})

const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
  beforeLoad: checkAuth
});

const profileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
  beforeLoad: checkAuth
});

const urlsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/urls',
  component: UrlsPage,
  beforeLoad: checkAuth
});

// Create route tree
const routeTree = rootRoute.addChildren([homeRoute, authRoute, dashboardRoute, profileRoute, urlsRoute])

// Create and export router
export const router = createRouter({ routeTree })

