# DateRangePicker with Time Functionality

This guide explains how to use the improved DateRangePicker component that now supports time selection and better filtering capabilities.

## Features

- ✅ Date range selection with calendar interface
- ✅ Optional time selection (hours and minutes)
- ✅ Apply/Cancel/Clear functionality
- ✅ Proper state management with temporary changes
- ✅ Custom hook for easy filtering integration
- ✅ TypeScript support
- ✅ Dark theme compatible

## Basic Usage

### Simple Date Range Picker

```tsx
import { DatePickerWithRange } from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";

function MyComponent() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  return <DatePickerWithRange date={dateRange} setDate={setDateRange} />;
}
```

### Date Range Picker with Time

```tsx
import { DatePickerWithRange } from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";

function MyComponent() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const handleDateChange = (range: DateRange) => {
    console.log("Date range changed:", range);
    // Handle the date change
  };

  return (
    <DatePickerWithRange
      date={dateRange}
      setDate={setDateRange}
      includeTime={true}
      onDateChange={handleDateChange}
    />
  );
}
```

## Using the Custom Hook

For easier filtering integration, use the `useDateRangeFilter` hook:

```tsx
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";

interface MyData {
  id: number;
  title: string;
  createdAt: Date;
}

function MyFilteredComponent() {
  const data: MyData[] = [
    { id: 1, title: "Item 1", createdAt: new Date("2024-01-15") },
    { id: 2, title: "Item 2", createdAt: new Date("2024-01-20") },
  ];

  const {
    dateRange,
    setDateRange,
    filteredData,
    handleDateChange,
    clearFilter,
    isFilterActive,
  } = useDateRangeFilter<MyData>({
    data,
    dateField: "createdAt",
    onFilterChange: (filtered) => {
      console.log("Filtered data:", filtered);
    },
  });

  return (
    <div>
      <DatePickerWithRange
        date={dateRange}
        setDate={setDateRange}
        includeTime={true}
        onDateChange={handleDateChange}
      />

      {isFilterActive && (
        <p>
          Showing {filteredData.length} of {data.length} items
        </p>
      )}

      {filteredData.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

## Props

### DatePickerWithRange Props

| Prop           | Type                                              | Default | Description                   |
| -------------- | ------------------------------------------------- | ------- | ----------------------------- |
| `date`         | `DateRange`                                       | -       | Current date range state      |
| `setDate`      | `React.Dispatch<React.SetStateAction<DateRange>>` | -       | Function to update date range |
| `className`    | `string`                                          | -       | Additional CSS classes        |
| `includeTime`  | `boolean`                                         | `false` | Enable time selection         |
| `onDateChange` | `(range: DateRange) => void`                      | -       | Callback when date changes    |

### useDateRangeFilter Hook Props

| Prop             | Type                          | Description                                  |
| ---------------- | ----------------------------- | -------------------------------------------- |
| `data`           | `T[]`                         | Array of data to filter                      |
| `dateField`      | `keyof T`                     | Field name containing the date to filter by  |
| `onFilterChange` | `(filteredData: T[]) => void` | Optional callback when filtered data changes |

## Hook Return Values

| Value              | Type                                              | Description                          |
| ------------------ | ------------------------------------------------- | ------------------------------------ |
| `dateRange`        | `DateRange`                                       | Current date range                   |
| `setDateRange`     | `React.Dispatch<React.SetStateAction<DateRange>>` | Function to update date range        |
| `filteredData`     | `T[]`                                             | Filtered data based on date range    |
| `handleDateChange` | `(range: DateRange) => void`                      | Function to handle date changes      |
| `clearFilter`      | `() => void`                                      | Function to clear the filter         |
| `isFilterActive`   | `boolean`                                         | Whether a filter is currently active |

## Time Selection

When `includeTime={true}`, the component provides:

- **Start Time**: Hours and minutes for the start date
- **End Time**: Hours and minutes for the end date
- **Default Times**:
  - Start date: 00:00 (midnight)
  - End date: 23:59 (end of day)

## Filtering Logic

The filtering logic works as follows:

1. **No filter**: If no start date is selected, all data is shown
2. **Start date only**: Shows data from the start date onwards
3. **End date only**: Shows data up to the end date
4. **Both dates**: Shows data between start and end dates (inclusive)

## Styling

The component uses a dark theme by default with these colors:

- Background: `bg-gray-800`
- Borders: `border-gray-600`
- Text: `text-white`
- Buttons: `bg-gray-700` with hover states

You can customize the styling by passing additional classes via the `className` prop.

## Example Implementation

See `DateRangeFilterExample.tsx` for a complete working example that demonstrates:

- Basic date range selection
- Time selection toggle
- Filter application
- Results display
- Debug information

## Troubleshooting

### Common Issues

1. **Time not showing**: Make sure `includeTime={true}` is set
2. **Filter not working**: Check that the `dateField` prop matches your data structure
3. **Type errors**: Ensure your data interface includes the date field you're filtering by

### Performance Tips

- Use `React.memo` for components that use the DateRangePicker
- Use the `useDateRangeFilter` hook for automatic memoization
- Avoid creating new objects in render functions

## Migration from Old Version

If you're upgrading from the old DateRangePicker:

1. Add the `includeTime` prop if you need time selection
2. Use the `onDateChange` callback for immediate filtering
3. Consider using the `useDateRangeFilter` hook for better performance
4. Update any custom styling to match the new structure
