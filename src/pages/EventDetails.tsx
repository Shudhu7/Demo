import React, { useState, useEffect } from 'react'; // ADD useEffect
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { events } from '@/data/events';
import { useAuth } from '@/contexts/AuthContext';
import { useWebSocketContext } from '@/contexts/WebSocketContext'; // ADD THIS IMPORT
import EnhancedFooter from '@/components/EnhancedFooter';

import { Calendar, MapPin, Users, Clock, ArrowLeft, Ticket, Wifi } from 'lucide-react';
import { format } from 'date-fns';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { subscribe, sendMessage, isConnected } = useWebSocketContext(); // ADD THIS

  const [selectedTickets, setSelectedTickets] = useState(1);
  const [realTimeSeats, setRealTimeSeats] = useState<number | null>(null); // ADD THIS
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null); // ADD THIS

  const event = events.find(e => e.id === id);

  // ADD WEBSOCKET FUNCTIONALITY
  useEffect(() => {
    if (id && isConnected) {
      console.log('🔗 Subscribing to real-time updates for event:', id);

      // Subscribe to seat availability updates for this specific event
      const unsubscribeSeats = subscribe(`/topic/seats/${id}`, (message) => {
        console.log('💺 Seat update received:', message);
        if (message.availableSeats !== undefined) {
          setRealTimeSeats(message.availableSeats);
          setLastUpdate(new Date());
        }
      });

      // Subscribe to general event updates
      const unsubscribeEvent = subscribe(`/topic/events/${id}`, (message) => {
        console.log('📅 Event update received:', message);
        // Handle event updates (price changes, time changes, etc.)
        if (message.type === 'EVENT_UPDATED') {
          setLastUpdate(new Date());
        }
      });

      // Send a message to backend that user is viewing this event
      sendMessage('/app/events/view', {
        eventId: id,
        action: 'VIEW_EVENT',
        timestamp: new Date().toISOString()
      });

      // Cleanup subscriptions when component unmounts or event changes
      return () => {
        console.log('🔌 Unsubscribing from event updates');
        unsubscribeSeats();
        unsubscribeEvent();
      };
    }
  }, [id, isConnected, subscribe, sendMessage]);

  // Use real-time seat data if available, otherwise use static data
  const currentAvailableSeats = realTimeSeats !== null ? realTimeSeats : event?.availableSeats || 0;

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">The event you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'EEEE, MMMM dd, yyyy');

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: `/event/${event.id}` } });
      return;
    }

    // Send booking intent to backend via WebSocket
    if (isConnected) {
      sendMessage('/app/bookings/intent', {
        eventId: event.id,
        requestedTickets: selectedTickets,
        userId: 'current-user', // You can get this from auth context
        timestamp: new Date().toISOString()
      });
    }

    navigate(`/booking/${event.id}`, { state: { tickets: selectedTickets } });
  };

  const totalPrice = event.price * selectedTickets;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="aspect-video rounded-lg overflow-hidden mb-6">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="">{event.category}</Badge>
                  {/* ADD REAL-TIME STATUS INDICATOR */}
                  {isConnected && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Wifi className="h-3 w-3" />
                      Live Updates
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3" />
                    <div>
                      <p className="font-medium">{formattedDate}</p>
                      <p className="text-sm">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm">{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3" />
                    <div>
                      <p className="font-medium">Available Seats</p>
                      <p className="text-sm">
                        {/* SHOW REAL-TIME SEAT COUNT */}
                        <span className={realTimeSeats !== null ? 'font-bold text-primary' : ''}>
                          {currentAvailableSeats}
                        </span> of {event.totalSeats}
                        {realTimeSeats !== null && (
                          <span className="text-xs text-green-600 ml-1">● Live</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Ticket className="w-5 h-5 mr-3" />
                    <div>
                      <p className="font-medium">Price per ticket</p>
                      <p className="text-sm font-bold text-primary">${event.price}</p>
                    </div>
                  </div>
                </div>

                {/* ADD LAST UPDATE INDICATOR */}
                {lastUpdate && (
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    Last updated: {lastUpdate.toLocaleTimeString()}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                <p className="text-gray-600 leading-relaxed">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Book Your Tickets</h3>
                    <p className="text-3xl font-bold text-primary">${event.price} <span className="text-base font-normal text-gray-600">per ticket</span></p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Tickets
                    </label>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTickets(Math.max(1, selectedTickets - 1))}
                        disabled={selectedTickets <= 1}
                      >
                        -
                      </Button>
                      <span className="text-lg font-medium w-8 text-center">{selectedTickets}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTickets(Math.min(currentAvailableSeats, selectedTickets + 1))}
                        disabled={selectedTickets >= currentAvailableSeats}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* ADD REAL-TIME SEAT AVAILABILITY WARNING */}
                  {currentAvailableSeats <= 10 && currentAvailableSeats > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-sm text-orange-800">
                        ⚠️ Only {currentAvailableSeats} seats left! Book now to secure your spot.
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-medium">Total:</span>
                      <span className="text-2xl font-bold text-primary">${totalPrice}</span>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={handleBookNow}
                      disabled={currentAvailableSeats === 0}
                    >
                      {currentAvailableSeats === 0 ? 'Sold Out' : 'Book Now'}
                    </Button>

                    {!isAuthenticated && (
                      <p className="text-sm text-gray-600 mt-2 text-center">
                        You'll need to login to complete your booking
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Instant booking confirmation</p>
                    <p>• Secure payment processing</p>
                    <p>• Mobile tickets available</p>
                    {/* ADD REAL-TIME INDICATOR */}
                    {isConnected && (
                      <p className="text-green-600">• Real-time seat availability ●</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <EnhancedFooter />
    </div>
  );
};

export default EventDetails;