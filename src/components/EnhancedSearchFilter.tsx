// src/components/EnhancedSearchFilter.tsx
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, MapPin, Filter, X } from 'lucide-react';
import { Event } from '@/types/event';

interface EnhancedSearchFilterProps {
  events: Event[];
  onFilteredEvents: (events: Event[]) => void;
  categories: string[];
}

interface FilterState {
  searchTerm: string;
  selectedCategories: string[];
  priceRange: [number, number];
  dateRange: {
    start: string;
    end: string;
  };
  location: string;
  sortBy: 'date' | 'price-low' | 'price-high' | 'title' | 'popularity';
}

const EnhancedSearchFilter: React.FC<EnhancedSearchFilterProps> = ({
  events,
  onFilteredEvents,
  categories
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCategories: [],
    priceRange: [0, 500],
    dateRange: {
      start: '',
      end: ''
    },
    location: '',
    sortBy: 'date'
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Get min and max prices from events
  const priceRange = useMemo(() => {
    const prices = events.map(event => event.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [events]);

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
      // Search term filter
      const matchesSearch = filters.searchTerm === '' || 
        event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = filters.selectedCategories.length === 0 || 
        filters.selectedCategories.includes(event.category);

      // Price range filter
      const matchesPrice = event.price >= filters.priceRange[0] && 
        event.price <= filters.priceRange[1];

      // Date range filter
      const matchesDate = (() => {
        if (!filters.dateRange.start && !filters.dateRange.end) return true;
        const eventDate = new Date(event.date);
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
        
        if (startDate && endDate) {
          return eventDate >= startDate && eventDate <= endDate;
        } else if (startDate) {
          return eventDate >= startDate;
        } else if (endDate) {
          return eventDate <= endDate;
        }
        return true;
      })();

      // Location filter
      const matchesLocation = filters.location === '' || 
        event.location.toLowerCase().includes(filters.location.toLowerCase());

      return matchesSearch && matchesCategory && matchesPrice && matchesDate && matchesLocation;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popularity':
          return (b.totalSeats - b.availableSeats) - (a.totalSeats - a.availableSeats);
        case 'date':
        default:
          return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

    return filtered;
  }, [events, filters]);

  // Update parent component when filtered events change
  React.useEffect(() => {
    onFilteredEvents(filteredAndSortedEvents);
  }, [filteredAndSortedEvents, onFilteredEvents]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle category selection
  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category]
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      selectedCategories: [],
      priceRange: [priceRange.min, priceRange.max],
      dateRange: {
        start: '',
        end: ''
      },
      location: '',
      sortBy: 'date'
    });
  };

  // Check if any filters are active
  const hasActiveFilters = filters.searchTerm || 
    filters.selectedCategories.length > 0 || 
    filters.priceRange[0] > priceRange.min || 
    filters.priceRange[1] < priceRange.max ||
    filters.dateRange.start || 
    filters.dateRange.end || 
    filters.location ||
    filters.sortBy !== 'date';

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (Earliest)</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {filters.selectedCategories.length + 
                 (filters.priceRange[0] > priceRange.min || filters.priceRange[1] < priceRange.max ? 1 : 0) +
                 (filters.dateRange.start || filters.dateRange.end ? 1 : 0) +
                 (filters.location ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Categories */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.filter(cat => cat !== 'All').map(category => (
                    <Button
                      key={category}
                      variant={filters.selectedCategories.includes(category) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory(category)}
                      className="text-xs"
                    >
                      {category}
                      {filters.selectedCategories.includes(category) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value)}
                  min={priceRange.min}
                  max={priceRange.max}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>${priceRange.min}</span>
                  <span>${priceRange.max}</span>
                </div>
              </div>

              {/* Location */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Enter location..."
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="md:col-span-2">
                <Label className="text-sm font-medium mb-3 block">Date Range</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => handleFilterChange('dateRange', {
                        ...filters.dateRange,
                        start: e.target.value
                      })}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => handleFilterChange('dateRange', {
                        ...filters.dateRange,
                        end: e.target.value
                      })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  disabled={!hasActiveFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? 's' : ''} found
        </span>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default EnhancedSearchFilter;