import { useState, useCallback, useMemo } from "react";
import { DateRange } from "react-day-picker";

interface UseDateRangeFilterOptions<T> {
  data: T[];
  dateField: keyof T;
  onFilterChange?: (filteredData: T[]) => void;
}

export function useDateRangeFilter<T>({
  data,
  dateField,
  onFilterChange,
}: UseDateRangeFilterOptions<T>) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const filteredData = useMemo(() => {
    if (!dateRange.from) {
      return data;
    }

    return data.filter((item) => {
      const itemDate = new Date(item[dateField] as any);

      // Check if item date is after or equal to start date
      if (dateRange.from && itemDate < dateRange.from) {
        return false;
      }

      // Check if item date is before or equal to end date
      if (dateRange.to && itemDate > dateRange.to) {
        return false;
      }

      return true;
    });
  }, [data, dateRange, dateField]);

  const handleDateChange = useCallback(
    (range: DateRange) => {
      setDateRange(range);
      if (onFilterChange) {
        // Calculate filtered data immediately for the callback
        if (!range.from) {
          onFilterChange(data);
          return;
        }

        const filtered = data.filter((item) => {
          const itemDate = new Date(item[dateField] as any);

          if (range.from && itemDate < range.from) {
            return false;
          }

          if (range.to && itemDate > range.to) {
            return false;
          }

          return true;
        });

        onFilterChange(filtered);
      }
    },
    [data, dateField, onFilterChange]
  );

  const clearFilter = useCallback(() => {
    const clearedRange = { from: undefined, to: undefined };
    setDateRange(clearedRange);
    if (onFilterChange) {
      onFilterChange(data);
    }
  }, [data, onFilterChange]);

  const isFilterActive = useMemo(() => {
    return !!(dateRange.from || dateRange.to);
  }, [dateRange]);

  return {
    dateRange,
    setDateRange,
    filteredData,
    handleDateChange,
    clearFilter,
    isFilterActive,
  };
}
