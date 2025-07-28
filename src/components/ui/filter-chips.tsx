import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterChip {
  id: string;
  label: string;
  value: string;
  removable?: boolean;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onRemove: (chipId: string) => void;
  onClear?: () => void;
  className?: string;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  chips,
  onRemove,
  onClear,
  className
}) => {
  if (chips.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {chips.map((chip) => (
        <Badge
          key={chip.id}
          variant="secondary"
          className="flex items-center gap-1 px-3 py-1"
        >
          <span className="text-xs font-medium">{chip.label}: {chip.value}</span>
          {chip.removable !== false && (
            <button
              onClick={() => onRemove(chip.id)}
              className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}
      
      {onClear && chips.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-xs h-7 px-2"
        >
          Clear all
        </Button>
      )}
    </div>
  );
};