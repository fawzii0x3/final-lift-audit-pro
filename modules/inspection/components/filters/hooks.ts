import { useState, useCallback } from "react";

export interface InspectionFiltersType {
  year?: string;
  month?: string;
  day?: string;
  equipmentNumber?: string;
}

export const useInspectionFilters = () => {
  const [filters, setFilters] = useState<InspectionFiltersType>({});
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = useCallback(
    (key: keyof InspectionFiltersType, value: string | undefined) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value || undefined,
      }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined,
  );

  return {
    filters,
    showFilters,
    hasActiveFilters,
    updateFilter,
    clearFilters,
    toggleFilters,
  };
};
