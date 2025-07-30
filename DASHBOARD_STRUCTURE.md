# Dashboard Nested Route Structure

## Overview

The dashboard has been restructured to use nested routes with shared filtering and state management. This provides a cleaner separation of concerns and better user experience.

## Structure

```
/dashboard/
├── layout.tsx          # Shared layout with filters, stats, and navigation
├── page.tsx            # Vehicle Info table (simplified view)
└── entries/
    └── page.tsx        # Vehicle Entries table (detailed view)
```

## Components

### DashboardLayout (`/dashboard/layout.tsx`)

- **Purpose**: Shared layout component that contains:
  - Header with user info and export functionality
  - Statistics cards (Total Vehicles, Unique Drivers, Companies, Today's Entries)
  - Analytics chart showing vehicle entries over time
  - Summary statistics with top companies and drivers
  - **Shared filter component** with:
    - Date range picker
    - Search functionality
    - Company filter
    - Sort options
  - Navigation buttons to switch between tables
  - Children render area for table content

### VehicleInfoTable (`/dashboard/page.tsx`)

- **Purpose**: Simplified vehicle information view
- **Columns**: Truck #, Driver, Company, Phone, Trailer #, Tank, Actions
- **Features**:
  - Focused on essential vehicle information
  - Action button to view detailed modal
  - Uses shared filters from layout

### VehicleEntriesTable (`/dashboard/entries/page.tsx`)

- **Purpose**: Detailed vehicle entries view
- **Columns**: Queue #, Order #, Company, Customer, Order Date, Truck #, Driver, Trailer #, Drums, Amount (L), Tank, Created, Actions
- **Features**:
  - Complete entry information
  - All original columns from the previous dashboard
  - Action button to view detailed modal
  - Uses shared filters from layout

## State Management

### DashboardContext (`/contexts/DashboardContext.tsx`)

- **Purpose**: Centralized state management for dashboard data
- **Shared State**:
  - `vehicles`: All vehicles from API
  - `filteredVehicles`: Vehicles after applying filters
  - `isLoading`: Loading state
  - `dateRange`: Date filter range
  - `searchTerm`: Search filter
  - `companyFilter`: Company filter
  - `sortBy`: Sort field
  - `sortOrder`: Sort direction
- **Functions**:
  - `fetchVehicles()`: Load vehicles from API
  - `setDateRange()`, `setSearchTerm()`, etc.: Update filters
  - `clearFilters()`: Reset all filters

## Key Features

### Shared Filtering

- Both tables use the same filter state
- Changes in filters affect both views simultaneously
- Consistent filtering experience across the dashboard

### Navigation

- Toggle buttons above the table area
- Active state indication
- Smooth navigation between views

### Responsive Design

- Mobile-friendly layout
- Responsive table design
- Adaptive navigation

### Data Consistency

- Single source of truth for vehicle data
- Real-time filter updates
- Consistent loading states

## Usage

1. **Navigate to Dashboard**: `/dashboard` (defaults to Vehicle Info view)
2. **Switch Views**: Use the navigation buttons above the table
3. **Apply Filters**: Use the shared filter component
4. **View Details**: Click the eye icon in the Actions column
5. **Export Data**: Use the Export CSV button in the header

## Benefits

- **Better UX**: Users can quickly switch between simplified and detailed views
- **Shared State**: Filters apply to both views consistently
- **Maintainable**: Clean separation of concerns
- **Scalable**: Easy to add more table views in the future
- **Performance**: Single data fetch shared across views
