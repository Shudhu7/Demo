// src/pages/Wishlist.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import EventCard from '@/components/EventCard';
import { useWishlist } from '@/contexts/WishlistContext';
import { events } from '@/data/events';
import { Heart, Calendar, ArrowLeft } from 'lucide-react';
import EnhancedFooter from '@/components/EnhancedFooter';


const Wishlist: React.FC = () => {
  const { wishlist } = useWishlist();
  
  // Get wishlist events from the events data
  const wishlistEvents = events.filter(event => wishlist.includes(event.id));

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

        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Heart className="h-8 w-8 text-red-500 mr-3 fill-current" />
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-600">
            {wishlistEvents.length === 0 
              ? "You haven't added any events to your wishlist yet."
              : `You have ${wishlistEvents.length} event${wishlistEvents.length !== 1 ? 's' : ''} in your wishlist.`
            }
          </p>
        </div>

        {wishlistEvents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Start exploring events and save your favorites for later!
              </p>
              <Button asChild>
                <Link to="/">
                  <Calendar className="mr-2 h-4 w-4" />
                  Browse Events
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
      <EnhancedFooter />
    </div>
  );
};

export default Wishlist;