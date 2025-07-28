import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Event } from '@/types/event';
import MobileOptimizedEventCard from './MobileOptimizedEventCard';
import { Grid, List } from 'lucide-react';
import { InfiniteScroll } from '@/components/ui/infinite-scroll';

interface MobileEventGridProps {
  events: Event[];
}

const MobileEventGrid: React.FC<MobileEventGridProps> = ({ events }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="md:hidden">
      {/* View Toggle */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {events.length} events found
        </span>
        <div className="flex items-center space-x-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Events List */}
      <div className="px-4 py-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-4">
            {events.map((event) => (
              <MobileOptimizedEventCard key={event.id} event={event} view="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <MobileOptimizedEventCard key={event.id} event={event} view="list" />
            ))}
          </div>
        )}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No events found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default MobileEventGrid;

