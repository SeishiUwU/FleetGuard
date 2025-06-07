import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ActiveFilter {
  type: 'company' | 'vehicle' | 'eventType';
  label: string;
  value: string;
}

interface FilterChipsProps {
  activeFilters: ActiveFilter[];
  onClearFilter: (filterType: 'company' | 'vehicle' | 'eventType') => void;
  onClearAll: () => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  activeFilters,
  onClearFilter,
  onClearAll,
}) => {
  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {activeFilters.map((filter, index) => (
        <div
          key={index}
          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
        >
          <span>{filter.label}</span>
          <button
            onClick={() => onClearFilter(filter.type)}
            className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-gray-500 hover:text-gray-700"
      >
        Clear all
      </Button>
    </div>
  );
};