import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/types/event';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from '@/contexts/ThemeContext';
import WishlistButton from './WishlistButton';

interface ThemeAwareEventCardProps {
  event: Event;
}

const ThemeAwareEventCard: React.FC<ThemeAwareEventCardProps> = ({ event }) => {
  const { isDark } = useTheme();
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'MMM dd, yyyy');
  
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${
      isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:shadow-xl'
    }`}>
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <WishlistButton eventId={event.id} />
        </div>
        <Badge className="absolute top-2 left-2" variant="secondary">
          {event.category}
        </Badge>
      </div>
      
      <CardContent className="p-6">
        <h3 className={`text-xl font-semibold mb-2 line-clamp-1 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {event.title}
        </h3>
        <p className={`mb-4 line-clamp-2 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {event.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className={`flex items-center text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Calendar className="w-4 h-4 mr-2" />
            {formattedDate} at {event.time}
          </div>
          
          <div className={`flex items-center text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
          
          <div className={`flex items-center text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Users className="w-4 h-4 mr-2" />
            {event.availableSeats} seats available
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            ${event.price}
          </div>
          
          <Button asChild>
            <Link to={`/event/${event.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeAwareEventCard;
