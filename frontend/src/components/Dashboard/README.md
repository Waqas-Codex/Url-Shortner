# Dashboard Components

This folder contains all the refactored components for the Dashboard page, organized for maintainability and reusability.

## File Structure

```
Dashboard/
├── index.js                 # Barrel export for easy importing
├── dashboard.css           # Shared animations and styles
├── DashboardPage.jsx       # Main page component (moved to pages/)
├── DashboardHeader.jsx     # Header with title and refresh button
├── StatCard.jsx            # Stats display cards
├── Toolbar.jsx             # Search and sort controls
├── UrlsList.jsx            # Conditional rendering for URLs list
├── UrlRow.jsx              # Individual URL entry row
├── EmptyState.jsx          # Empty state UI
├── ListFooter.jsx          # Footer with count info
└── icons.js                # Reusable SVG icons
```

## Components Overview

### DashboardHeader
- **Props**: `urls`, `totalClicks`, `onRefresh`, `refreshing`
- **Purpose**: Displays the dashboard title and refresh button
- **Status**: Includes animated header and stats cards

### StatCard
- **Props**: `icon`, `label`, `value`, `gradient`, `delay`
- **Purpose**: Individual stat card with gradient background and animation

### Toolbar
- **Props**: `search`, `onSearchChange`, `sortBy`, `onSortChange`
- **Purpose**: Search input and sort dropdown

### UrlsList
- **Props**: `loading`, `error`, `filtered`, `urls`, `baseUrl`, `onRetry`
- **Purpose**: Handles loading, error, empty state, and URL list rendering

### UrlRow
- **Props**: `entry`, `index`, `baseUrl`
- **Purpose**: Individual URL row with copy functionality and click stats

### EmptyState
- **Purpose**: Shows when no URLs exist

### ListFooter
- **Props**: `loading`, `error`, `filtered`, `urls`
- **Purpose**: Shows count of displayed vs total URLs

### Icons Module
Exports: `LinkIcon`, `ClickIcon`, `CopyIcon`, `CheckIcon`, `ExternalLinkIcon`, `RefreshIcon`, `ErrorIcon`, `SearchIcon`, `LoadingSpinner`

## Usage

### Import individual components:
```jsx
import StatCard from './StatCard'
import { DashboardHeader } from './DashboardHeader'
```

### Or import from barrel:
```jsx
import { StatCard, DashboardHeader, Toolbar } from '../components/Dashboard'
```

## Styling

- All animations are defined in `dashboard.css`
- Tailwind CSS for utility styles
- Animations: `fadeSlideUp`, `spin`

## Key Features

✅ **Modular Design** - Each component has a single responsibility
✅ **Reusable Icons** - Centralized SVG icons module
✅ **Shared Animations** - CSS file for consistent animations
✅ **Error Handling** - Dedicated error state component
✅ **Loading States** - Spinner component for loading indication
✅ **Responsive** - Mobile-first design with Tailwind
