// src/components/dashboard/Events.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Edit,
  Trash2,
  Ticket,
  Search,
  Calendar,
  MapPin,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye
} from 'lucide-react';
import { events } from '@/data/events';

// Types and Interfaces
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  category: string;
  image: string;
}

interface EventFilters {
  searchTerm: string;
  selectedCategory: string;
  dateFrom: string;
  dateTo: string;
  priceMin: string;
  priceMax: string;
  sortBy: 'title' | 'date' | 'price' | 'category' | 'seats';
  sortOrder: 'asc' | 'desc';
}

interface NewEvent {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: string;
  totalSeats: string;
  category: string;
  image: string;
}

interface EventsProps {
  className?: string;
}

const Events: React.FC<EventsProps> = ({ className }) => {
  const { toast } = useToast();

  // State Management
  const [eventsList, setEventsList] = useState<Event[]>(events);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    totalSeats: '',
    category: '',
    image: ''
  });

  // Filter States
  const [filters, setFilters] = useState<EventFilters>({
    searchTerm: '',
    selectedCategory: 'all',
    dateFrom: '',
    dateTo: '',
    priceMin: '',
    priceMax: '',
    sortBy: 'date',
    sortOrder: 'asc'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(10);

  // Mobile Detection
  useEffect(() => {
    const checkIsMobile = () => {
      // Use a common mobile breakpoint, e.g., 768px for tablets and smaller
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Set initial state
    checkIsMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  // Available categories from events data
  const eventCategories = ['all', ...Array.from(new Set(eventsList.map(event => event.category)))];

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = eventsList.filter(event => {
      // Search filter
      const matchesSearch = filters.searchTerm === '' ||
        event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = filters.selectedCategory === 'all' ||
        event.category === filters.selectedCategory;

      // Date range filter
      const matchesDateFrom = filters.dateFrom === '' ||
        new Date(event.date) >= new Date(filters.dateFrom);
      const matchesDateTo = filters.dateTo === '' ||
        new Date(event.date) <= new Date(filters.dateTo);

      // Price range filter
      const matchesPriceMin = filters.priceMin === '' ||
        event.price >= parseFloat(filters.priceMin);
      const matchesPriceMax = filters.priceMax === '' ||
        event.price <= parseFloat(filters.priceMax);

      return matchesSearch && matchesCategory && matchesDateFrom &&
             matchesDateTo && matchesPriceMin && matchesPriceMax;
    });

    // Sort events
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'seats':
          comparison = a.availableSeats - b.availableSeats;
          break;
        default:
          comparison = 0;
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [eventsList, filters]);

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredAndSortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredAndSortedEvents.length / eventsPerPage);

  // Utility Functions
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const getCategoryBadgeVariant = (category: string) => {
    const variants: Record<string, any> = {
      'Concert': 'default',
      'Workshop': 'secondary',
      'Conference': 'outline',
      'Sports': 'destructive',
    };
    return variants[category] || 'outline';
  };

  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      selectedCategory: 'all',
      dateFrom: '',
      dateTo: '',
      priceMin: '',
      priceMax: '',
      sortBy: 'date',
      sortOrder: 'asc'
    });
    setCurrentPage(1);
  };

  // Event Management Functions
  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const event: Event = {
      id: `event_${Date.now()}`,
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      price: parseFloat(newEvent.price) || 0,
      totalSeats: parseInt(newEvent.totalSeats) || 0,
      availableSeats: parseInt(newEvent.totalSeats) || 0,
      category: newEvent.category,
      image: newEvent.image
    };

    setEventsList([...eventsList, event]);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      price: '',
      totalSeats: '',
      category: '',
      image: ''
    });
    setIsCreateModalOpen(false);
    
    toast({
      title: "Event Created",
      description: `Event "${event.title}" has been created successfully.`,
    });
  };

  const handleEditEvent = () => {
    if (!selectedEvent) return;

    if (!selectedEvent.title || !selectedEvent.date || !selectedEvent.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setEventsList(eventsList.map(event => 
      event.id === selectedEvent.id ? selectedEvent : event
    ));
    setIsEditModalOpen(false);
    setSelectedEvent(null);
    
    toast({
      title: "Event Updated",
      description: `Event "${selectedEvent.title}" has been updated successfully.`,
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    const event = eventsList.find(e => e.id === eventId);
    if (!event) return;

    setEventsList(eventsList.filter(e => e.id !== eventId));
    
    toast({
      title: "Event Deleted",
      description: `Event "${event.title}" has been deleted successfully.`,
    });
  };

  const handleViewEvent = (eventId: string) => {
    const event = eventsList.find(e => e.id === eventId);
    if (event) {
      toast({
        title: "Event Details",
        description: `Viewing details for "${event.title}"`,
      });
    }
  };

  // Mobile Card Component for Events
  const EventMobileCard = ({ event }: { event: Event }) => (
    <Card className="dark:bg-gray-800 dark:border-gray-700 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-lg dark:text-white leading-tight pr-4">{event.title}</h3> {/* Title, wrapping */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-shrink-0 h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-gray-800 dark:border-gray-700 mx-4 max-w-lg">
              <DialogHeader>
                <DialogTitle className="dark:text-white">Event Actions</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 mt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleViewEvent(event.id)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedEvent({...event});
                    setIsEditModalOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Event
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Event
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700 mx-4 max-w-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="dark:text-white">Delete Event</AlertDialogTitle>
                      <AlertDialogDescription className="dark:text-gray-300">
                        Are you sure you want to delete "{event.title}"? This action cannot be undone.
                        All bookings and event data will be permanently removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0">
                      <AlertDialogCancel className="w-full sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteEvent(event.id)}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete Event
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Date and Price */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="font-medium dark:text-white">
            ${event.price}
          </div>
        </div>

        {/* Category (optional, based on image you sent) and other details if desired */}
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
            <Badge variant={getCategoryBadgeVariant(event.category)} className="w-fit">
              <span className="text-xs">{event.category}</span>
            </Badge>
            {/* You can add Location, Seats, Time here if you want them on the card */}
            {/* <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{event.location}</span>
            </div> */}
            {/* <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{event.availableSeats}/{event.totalSeats}</span>
            </div> */}
            {/* <div>{event.time || 'TBD'}</div> */}
        </div>
      </CardContent>
    </Card>
  );

  // Event Form Component (Remains unchanged)
  const EventForm = ({ 
    event, 
    onChange, 
    isEdit = false 
  }: { 
    event: any; 
    onChange: (event: any) => void; 
    isEdit?: boolean;
  }) => (
    <div className="space-y-4 mt-4">
      <div>
        <Label htmlFor={`${isEdit ? 'edit' : 'new'}EventTitle`} className="dark:text-gray-200">
          Event Title *
        </Label>
        <Input 
          id={`${isEdit ? 'edit' : 'new'}EventTitle`}
          value={event.title} 
          onChange={(e) => onChange({...event, title: e.target.value})} 
          placeholder="e.g., Summer Music Fest" 
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
        />
      </div>
      <div>
        <Label htmlFor={`${isEdit ? 'edit' : 'new'}EventDescription`} className="dark:text-gray-200">
          Description
        </Label>
        <Textarea 
          id={`${isEdit ? 'edit' : 'new'}EventDescription`}
          value={event.description} 
          onChange={(e) => onChange({...event, description: e.target.value})} 
          placeholder="Brief description of the event" 
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${isEdit ? 'edit' : 'new'}EventDate`} className="dark:text-gray-200">
            Date *
          </Label>
          <Input 
            id={`${isEdit ? 'edit' : 'new'}EventDate`}
            type="date" 
            value={event.date} 
            onChange={(e) => onChange({...event, date: e.target.value})} 
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
          />
        </div>
        <div>
          <Label htmlFor={`${isEdit ? 'edit' : 'new'}EventTime`} className="dark:text-gray-200">
            Time
          </Label>
          <Input 
            id={`${isEdit ? 'edit' : 'new'}EventTime`}
            type="time" 
            value={event.time} 
            onChange={(e) => onChange({...event, time: e.target.value})} 
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
          />
        </div>
      </div>
      <div>
        <Label htmlFor={`${isEdit ? 'edit' : 'new'}EventLocation`} className="dark:text-gray-200">
          Location *
        </Label>
        <Input 
          id={`${isEdit ? 'edit' : 'new'}EventLocation`}
          value={event.location} 
          onChange={(e) => onChange({...event, location: e.target.value})} 
          placeholder="e.g., Central Park" 
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${isEdit ? 'edit' : 'new'}EventPrice`} className="dark:text-gray-200">
            Price ($)
          </Label>
          <Input 
            id={`${isEdit ? 'edit' : 'new'}EventPrice`}
            type="number" 
            value={event.price} 
            onChange={(e) => onChange({...event, price: e.target.value})} 
            placeholder="e.g., 25.00" 
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
          />
        </div>
        <div>
          <Label htmlFor={`${isEdit ? 'edit' : 'new'}EventSeats`} className="dark:text-gray-200">
            Total Seats
          </Label>
          <Input 
            id={`${isEdit ? 'edit' : 'new'}EventSeats`}
            type="number" 
            value={event.totalSeats} 
            onChange={(e) => onChange({...event, totalSeats: e.target.value})} 
            placeholder="e.g., 500" 
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
          />
        </div>
      </div>
      <div>
        <Label htmlFor={`${isEdit ? 'edit' : 'new'}EventCategory`} className="dark:text-gray-200">
          Category
        </Label>
        <Input 
          id={`${isEdit ? 'edit' : 'new'}EventCategory`}
          value={event.category} 
          onChange={(e) => onChange({...event, category: e.target.value})} 
          placeholder="e.g., Concert, Workshop" 
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
        />
      </div>
      <div>
        <Label htmlFor={`${isEdit ? 'edit' : 'new'}EventImage`} className="dark:text-gray-200">
          Image URL
        </Label>
        <Input 
          id={`${isEdit ? 'edit' : 'new'}EventImage`}
          value={event.image} 
          onChange={(e) => onChange({...event, image: e.target.value})} 
          placeholder="https://example.com/image.jpg" 
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
        />
      </div>
    </div>
  );

  return (
    <div className={`space-y-4 px-2 sm:px-4 lg:px-6 ${className}`}>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <CardTitle className="flex items-center text-lg sm:text-xl dark:text-white">
              <Ticket className="mr-2 h-5 w-5" />
              Event Management
            </CardTitle>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="dark:bg-gray-800 dark:border-gray-700 mx-4 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="dark:text-white">Create New Event</DialogTitle>
                </DialogHeader>
                <EventForm 
                  event={newEvent} 
                  onChange={setNewEvent} 
                />
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateModalOpen(false)} 
                    className="w-full sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEvent} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {/* Enhanced Filters */}
          <div className="space-y-4 mb-6">
            {/* Primary Filters */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search events..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Select value={filters.selectedCategory} onValueChange={(value) => setFilters({...filters, selectedCategory: value})}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="all">All Categories</SelectItem>
                      {eventCategories.filter(cat => cat !== 'all').map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={`${filters.sortBy}-${filters.sortOrder}`} 
                    onValueChange={(value) => {
                      const [sortBy, sortOrder] = value.split('-');
                      setFilters({...filters, sortBy: sortBy as EventFilters['sortBy'], sortOrder: sortOrder as 'asc' | 'desc'});
                    }}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="date-asc">Date (Earliest)</SelectItem>
                      <SelectItem value="date-desc">Date (Latest)</SelectItem>
                      <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                      <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                      <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                      <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    placeholder="Min Price"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />

                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Clear All
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-sm font-medium dark:text-gray-200">From Date</Label>
                    <Input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium dark:text-gray-200">To Date</Label>
                    <Input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium dark:text-gray-200">Max Price</Label>
                    <Input
                      type="number"
                      placeholder="Max Price"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>
                Showing {indexOfFirstEvent + 1}-{Math.min(indexOfLastEvent, filteredAndSortedEvents.length)} of {filteredAndSortedEvents.length} events
              </span>
            </div>
          </div>

          {/* Events Display */}
          {isMobileView ? (
            <div className="space-y-3">
              {currentEvents.map((event) => (
                <EventMobileCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-gray-700">
                    <TableHead className="dark:text-gray-300">Event</TableHead>
                    <TableHead className="dark:text-gray-300">Date</TableHead>
                    <TableHead className="hidden md:table-cell dark:text-gray-300">Location</TableHead>
                    <TableHead className="dark:text-gray-300">Price</TableHead>
                    <TableHead className="hidden lg:table-cell dark:text-gray-300">Category</TableHead>
                    <TableHead className="hidden xl:table-cell dark:text-gray-300">Seats</TableHead>
                    <TableHead className="dark:text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentEvents.map((event) => (
                    <TableRow key={event.id} className="dark:border-gray-700">
                      <TableCell>
                        <div className="min-w-0">
                          <p className="font-medium truncate dark:text-white max-w-48">{event.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-48">{event.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">
                        <div className="text-sm whitespace-nowrap">{formatDate(event.date)}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell dark:text-gray-300">
                        <div className="max-w-32 truncate">{event.location}</div>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">
                        <span className="font-medium">${event.price}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell dark:text-gray-300">
                        <Badge variant={getCategoryBadgeVariant(event.category)} className="dark:text-white">
                          {event.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{event.availableSeats}</span>
                          <span className="text-gray-500">/{event.totalSeats}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewEvent(event.id)}
                            className="h-8 w-8 p-0 dark:text-gray-300 dark:hover:bg-gray-700"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Dialog open={isEditModalOpen && selectedEvent?.id === event.id} onOpenChange={(open) => {
                            setIsEditModalOpen(open);
                            if (!open) setSelectedEvent(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedEvent({...event})}
                                className="h-8 w-8 p-0 dark:text-gray-300 dark:hover:bg-gray-700"
                                title="Edit Event"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="dark:bg-gray-800 dark:border-gray-700 mx-4 max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="dark:text-white">Edit Event</DialogTitle>
                              </DialogHeader>
                              {selectedEvent && (
                                <>
                                  <EventForm 
                                    event={selectedEvent} 
                                    onChange={setSelectedEvent} 
                                    isEdit={true}
                                  />
                                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                                    <Button 
                                      variant="outline" 
                                      onClick={() => setIsEditModalOpen(false)} 
                                      className="w-full sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                      Cancel
                                    </Button>
                                    <Button onClick={handleEditEvent} className="w-full sm:w-auto">
                                      Save Changes
                                    </Button>
                                  </div>
                                </>
                              )}
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:bg-gray-700"
                                title="Delete Event"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700 mx-4 max-w-lg">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="dark:text-white">Delete Event</AlertDialogTitle>
                                <AlertDialogDescription className="dark:text-gray-300">
                                  Are you sure you want to delete "{event.title}"? This action cannot be undone.
                                  All bookings and event data will be permanently removed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0">
                                <AlertDialogCancel className="w-full sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete Event
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Empty State */}
          {filteredAndSortedEvents.length === 0 && (
            <div className="text-center py-12">
              <Ticket className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No events found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {filters.searchTerm || filters.selectedCategory !== 'all' || filters.dateFrom || filters.dateTo || filters.priceMin || filters.priceMax
                  ? 'Try adjusting your search or filters'
                  : 'No events have been created yet'
                }
              </p>
              {(filters.searchTerm || filters.selectedCategory !== 'all' || filters.dateFrom || filters.dateTo || filters.priceMin || filters.priceMax) && (
                <Button variant="outline" onClick={clearAllFilters} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Clear All Filters
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredAndSortedEvents.length > 0 && totalPages > 1 && (
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-300 text-center sm:text-left">
                Page {currentPage} of {totalPages} ({filteredAndSortedEvents.length} total events)
              </div>
              <div className="flex items-center justify-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Previous</span>
                </Button>
                
                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(isMobileView ? 3 : 5, totalPages) }, (_, index) => {
                    let pageNum;
                    const maxPages = isMobileView ? 3 : 5;
                    if (totalPages <= maxPages) {
                      pageNum = index + 1;
                    } else if (currentPage <= Math.ceil(maxPages / 2)) {
                      pageNum = index + 1;
                    } else if (currentPage >= totalPages - Math.floor(maxPages / 2)) {
                      pageNum = totalPages - maxPages + index + 1;
                    } else {
                      pageNum = currentPage - Math.floor(maxPages / 2) + index;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <span className="hidden sm:inline mr-1">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Statistics - Mobile-Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Total Events</p>
                <p className="text-lg sm:text-2xl font-bold dark:text-white">{eventsList.length}</p>
              </div>
              <Ticket className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Upcoming</p>
                <p className="text-lg sm:text-2xl font-bold dark:text-white">
                  {eventsList.filter(e => new Date(e.date) > new Date()).length}
                </p>
              </div>
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Categories</p>
                <p className="text-lg sm:text-2xl font-bold dark:text-white">
                  {Array.from(new Set(eventsList.map(e => e.category))).length}
                </p>
              </div>
              <Filter className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Total Seats</p>
                <p className="text-lg sm:text-2xl font-bold dark:text-white">
                  {eventsList.reduce((sum, e) => sum + e.totalSeats, 0)}
                </p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Events;