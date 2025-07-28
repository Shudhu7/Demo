// src/pages/Home.tsx - Enhanced with auto-scroll functionality
import React, { useState, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import EventCard from '@/components/EventCard';
import { events, categories } from '@/data/events';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import EnhancedFooter from '@/components/EnhancedFooter';
import { FilterChips } from '@/components/ui/filter-chips';
import { PriceRangeSlider } from '@/components/ui/price-range-slider';


const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchDate, setSearchDate] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  
  // Ref for the events section
  const eventsRef = useRef<HTMLElement>(null);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      
      const matchesDate = searchDate === '' || event.date === searchDate;
      
      const matchesLocation = searchLocation === '' || 
        event.location.toLowerCase().includes(searchLocation.toLowerCase());
      
      return matchesSearch && matchesCategory && matchesDate && matchesLocation;
    });
  }, [searchTerm, selectedCategory, searchDate, searchLocation]);

  // Enhanced category selection with auto-scroll
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    
    // Auto-scroll to events section after a brief delay to allow state update
    setTimeout(() => {
      if (eventsRef.current) {
        eventsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSearchDate('');
    setSearchLocation('');
    setSelectedCategory('All');
    
    // Scroll to events section after clearing filters
    setTimeout(() => {
      if (eventsRef.current) {
        eventsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="text-white" style={{ background: 'linear-gradient(to right, #0A1F44, #0d2757)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Find and book tickets for the best events in your area
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button 
              onClick={clearAllFilters}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section with Enhanced Styling */}
      <section className="py-6 bg-white dark:bg-gray-800 border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategorySelect(category)}
                className={`transition-all duration-200 ${
                  selectedCategory === category 
                    ? 'shadow-md transform scale-105' 
                    : 'hover:shadow-sm hover:scale-102'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">{events.length}+</h3>
                <p className="text-gray-600 dark:text-gray-300">Events Available</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">5K+</h3>
                <p className="text-gray-600 dark:text-gray-300">Happy Customers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">10+</h3>
                <p className="text-gray-600 dark:text-gray-300">Cities Covered</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Events Grid Section with ref for auto-scroll */}
      <section ref={eventsRef} className="py-12 scroll-mt-24" id="events-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedCategory === 'All' ? 'All Events' : `${selectedCategory} Events`}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </p>
            
            {/* Category indicator with animation */}
            {selectedCategory !== 'All' && (
              <div className="mt-4 animate-fade-in">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  Showing {selectedCategory} events
                </span>
              </div>
            )}
          </div>
          
          {/* Events Grid with loading animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="animate-slide-up"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="max-w-md mx-auto">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No events found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {selectedCategory === 'All' 
                    ? "No events match your search criteria. Try adjusting your filters."
                    : `No ${selectedCategory.toLowerCase()} events found. Try browsing other categories.`
                  }
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <EnhancedFooter />
      
      {/* Add custom CSS animations */}
     
    </div>
  );
};

export default Home;