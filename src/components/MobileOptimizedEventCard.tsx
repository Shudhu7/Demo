import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/types/event';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import WishlistButton from './WishlistButton';
import { useTheme } from '@/contexts/ThemeContext';

interface MobileOptimizedEventCardProps {
  event: Event;
  view?: 'grid' | 'list';
}

const MobileOptimizedEventCard: React.FC<MobileOptimizedEventCardProps> = ({ 
  event, 
  view = 'grid' 
}) => {
  const { isDark } = useTheme();
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'MMM dd');
  
  // Mobile List View (horizontal layout)
  if (view === 'list') {
    return (
      <Card className={`overflow-hidden hover:shadow-md transition-all duration-300 ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <Link to={`/event/${event.id}`}>
          <CardContent className="p-0">
            <div className="flex">
              {/* Image */}
              <div className="w-24 h-24 flex-shrink-0 relative">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1">
                  <WishlistButton eventId={event.id} size="sm" />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-3 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm line-clamp-1 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {event.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {event.category}
                    </Badge>
                  </div>
                  <div className="text-right ml-2">
                    <div className="text-lg font-bold text-primary">
                      ${event.price}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className={`flex items-center text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className={`flex items-center text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Users className="w-3 h-3 mr-1" />
                    {event.availableSeats} seats left
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  // Mobile Grid View (vertical layout)
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <Link to={`/event/${event.id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <WishlistButton eventId={event.id} size="sm" />
          </div>
          <Badge className="absolute top-2 left-2 text-xs" variant="secondary">
            {event.category}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <h3 className={`text-lg font-semibold mb-2 line-clamp-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {event.title}
          </h3>
          
          <div className="space-y-1 mb-3">
            <div className={`flex items-center text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Calendar className="w-4 h-4 mr-2" />
              {formattedDate} • {event.time}
            </div>
            
            <div className={`flex items-center text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <MapPin className="w-4 h-4 mr-2" />
              <span className="truncate">{event.location}</span>
            </div>
            
            <div className={`flex items-center text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Users className="w-4 h-4 mr-2" />
              {event.availableSeats} seats available
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-primary">
              ${event.price}
            </div>
            
            <Button size="sm" onClick={(e) => e.preventDefault()}>
              View Details
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default MobileOptimizedEventCard;