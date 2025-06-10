import React from 'react';

type FilterOption = {
  key: string;
  label: string;
  count: number;
  color: string;
};

type FilterButtonsProps<T> = {
  data: T[];
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  getFilterOptions: (data: T[]) => FilterOption[];
  className?: string;
};

export default function FilterButtons<T>({
  data,
  currentFilter,
  onFilterChange,
  getFilterOptions,
  className = "",
}: FilterButtonsProps<T>) {
  const filterOptions = getFilterOptions(data);

  const getButtonClasses = (option: FilterOption, isActive: boolean): string => {
    const baseClasses = "px-4 py-2 rounded-md text-sm font-medium transition";
    
    if (isActive) {
      return `${baseClasses} ${option.color} text-white`;
    }
    
    return `${baseClasses} bg-primary-dark text-white hover:${option.color} hover:text-white`;
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {filterOptions.map((option) => {
        const isActive = currentFilter === option.key;
        
        return (
          <button
            type='button'
            key={option.key}
            onClick={() => onFilterChange(option.key)}
            className={getButtonClasses(option, isActive)}
          >
            {option.label} ({option.count})
          </button>
        );
      })}
    </div>
  );
}