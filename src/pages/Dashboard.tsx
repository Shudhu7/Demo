// src/pages/Dashboard.tsx - With WebSocket Integration
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Navbar from '@/components/Navbar';
import UniversalBookingActions from '@/components/UniversalBookingActions';
import EnhancedFooter from '@/components/EnhancedFooter';

// Import the new dashboard components
import Overview from '@/components/dashboard/Overview';
import Events from '@/components/dashboard/Events';
import Users from '@/components/dashboard/Users';

import { useAuth } from '@/contexts/AuthContext';
import { useWebSocketContext } from '@/contexts/WebSocketContext'; // ADD THIS IMPORT
import { UserBooking } from '@/types/event';
import {
  Calendar,
  Clock,
  MapPin,
  Users as UsersIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Ticket,
  Wifi, // ADD THIS IMPORT
  Bell // ADD THIS IMPORT
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { subscribe, sendMessage, isConnected } = useWebSocketContext(); // ADD THIS
  const location = useLocation();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // ADD WEBSOCKET STATE
  const [realTimeNotifications, setRealTimeNotifications] = useState<any[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  // Check if we're on the bookings route or dashboard route
  const isBookingsPage = location.pathname === '/my-bookings';
  const isDashboardPage = location.pathname === '/dashboard';

  // ADD WEBSOCKET FUNCTIONALITY
  useEffect(() => {
    if (!user || !isConnected) return;

    console.log('🔗 Setting up Dashboard WebSocket subscriptions...');

    const subscriptions: (() => void)[] = [];

    // For regular users - booking updates
    if (user.role !== 'admin') {
      // Subscribe to user-specific booking updates
      const unsubscribeBookings = subscribe(`/user/${user.id}/queue/bookings`, (message) => {
        console.log('📋 Booking update received:', message);
        
        if (message.type === 'BOOKING_STATUS_UPDATED') {
          // Update booking status in real-time
          setBookings(prevBookings => 
            prevBookings.map(booking => 
              booking.id === message.bookingId 
                ? { ...booking, status: message.newStatus }
                : booking
            )
          );

          toast({
            title: "Booking Updated",
            description: `Your booking status has been updated to ${message.newStatus}`,
            duration: 5000,
          });
        }

        if (message.type === 'BOOKING_CONFIRMED') {
          // Refresh bookings when new booking is confirmed
          loadBookings();
          toast({
            title: "Booking Confirmed! 🎉",
            description: "Your event booking has been confirmed successfully.",
            duration: 5000,
          });
        }

        setLastUpdateTime(new Date());
      });

      // Subscribe to payment updates
      const unsubscribePayments = subscribe(`/user/${user.id}/queue/payments`, (message) => {
        console.log('💳 Payment update received:', message);
        
        if (message.type === 'PAYMENT_SUCCESSFUL') {
          toast({
            title: "Payment Successful! ✅",
            description: "Your payment has been processed successfully.",
            duration: 5000,
          });
        }

        setLastUpdateTime(new Date());
      });

      subscriptions.push(unsubscribeBookings, unsubscribePayments);
    }

    // For admin users - dashboard updates
    if (user.role === 'admin') {
      // Subscribe to admin dashboard updates
      const unsubscribeAdmin = subscribe('/topic/admin/dashboard', (message) => {
        console.log('👤 Admin dashboard update:', message);
        
        if (message.type === 'NEW_BOOKING') {
          setRealTimeNotifications(prev => [
            { id: Date.now(), type: 'booking', message: `New booking: ${message.eventTitle}`, time: new Date() },
            ...prev.slice(0, 9) // Keep only 10 most recent
          ]);

          toast({
            title: "New Booking! 📅",
            description: `${message.userName} booked ${message.eventTitle}`,
            duration: 4000,
          });
        }

        if (message.type === 'USER_REGISTERED') {
          setRealTimeNotifications(prev => [
            { id: Date.now(), type: 'user', message: `New user registered: ${message.userName}`, time: new Date() },
            ...prev.slice(0, 9)
          ]);

          toast({
            title: "New User! 👤",
            description: `${message.userName} just registered`,
            duration: 4000,
          });
        }

        setLastUpdateTime(new Date());
      });

      // Subscribe to system notifications
      const unsubscribeSystem = subscribe('/topic/system', (message) => {
        console.log('⚙️ System notification:', message);
        
        if (message.type === 'SYSTEM_ALERT') {
          toast({
            title: "System Alert",
            description: message.message,
            variant: "destructive",
            duration: 6000,
          });
        }

        setLastUpdateTime(new Date());
      });

      subscriptions.push(unsubscribeAdmin, unsubscribeSystem);
    }

    // Subscribe to general notifications for all users
    const unsubscribeGeneral = subscribe('/topic/notifications', (message) => {
      console.log('🔔 General notification:', message);
      
      toast({
        title: message.title || "Notification",
        description: message.message,
        duration: 4000,
      });

      setLastUpdateTime(new Date());
    });

    subscriptions.push(unsubscribeGeneral);

    // Send user activity to backend
    sendMessage('/app/user/activity', {
      userId: user.id,
      action: 'DASHBOARD_VIEW',
      page: isBookingsPage ? 'bookings' : 'dashboard',
      timestamp: new Date().toISOString()
    });

    // Cleanup function
    return () => {
      console.log('🔌 Cleaning up Dashboard WebSocket subscriptions');
      subscriptions.forEach(unsubscribe => unsubscribe());
    };
  }, [user, isConnected, subscribe, sendMessage, toast, isBookingsPage]);

  // Load user bookings
  const loadBookings = () => {
    setLoading(true);
    try {
      if (user) {
        const savedBookings = localStorage.getItem(`bookings_${user.id}`);
        if (savedBookings) {
          const parsedBookings = JSON.parse(savedBookings);
          const validBookings = parsedBookings.filter((booking: any) =>
            booking &&
            booking.id &&
            booking.eventTitle &&
            booking.status
          );
          setBookings(validBookings);
        } else {
          setBookings([]);
        }
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
      toast({
        title: "Error Loading Bookings",
        description: "There was an error loading your bookings. Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user, toast]);

  // Booking management functions
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date time:', error);
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const filterBookings = (filter: string) => {
    try {
      if (!Array.isArray(bookings)) {
        return [];
      }
      if (filter === 'all') return bookings;
      return bookings.filter(booking => booking && booking.status === filter);
    } catch (error) {
      console.error('Error filtering bookings:', error);
      return [];
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (!bookingId) {
      toast({
        title: "Error",
        description: "Invalid booking ID.",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const updatedBookings = bookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' as const }
            : booking
        );
        setBookings(updatedBookings);
        if (user) {
          localStorage.setItem(`bookings_${user.id}`, JSON.stringify(updatedBookings));
        }

        // Send cancellation to backend via WebSocket
        if (isConnected) {
          sendMessage('/app/bookings/cancel', {
            bookingId,
            userId: user?.id,
            timestamp: new Date().toISOString()
          });
        }

        toast({
          title: "Booking Cancelled",
          description: "Your booking has been cancelled successfully.",
        });
      } catch (error) {
        console.error('Error cancelling booking:', error);
        toast({
          title: "Error",
          description: "There was an error cancelling your booking. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Universal Booking Actions handlers
  const handleRatingSubmit = (bookingId: string, rating: number, review: string) => {
    console.log('Rating submitted:', { bookingId, rating, review });
    
    // Send rating to backend via WebSocket
    if (isConnected) {
      sendMessage('/app/reviews/submit', {
        bookingId,
        rating,
        review,
        userId: user?.id,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleDownloadComplete = (bookingId: string) => {
    console.log('Download completed for booking:', bookingId);
    
    // Track download activity via WebSocket
    if (isConnected) {
      sendMessage('/app/tickets/download', {
        bookingId,
        userId: user?.id,
        timestamp: new Date().toISOString()
      });
    }
  };

  const showToastMessage = (title: string, description: string, variant?: 'default' | 'destructive') => {
    toast({
      title,
      description,
      variant: variant || "default",
    });
  };

  // Authentication check
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Please Login</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">You need to be logged in to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render Bookings Page (for both regular users and admin when accessing /my-bookings)
  if (isBookingsPage || (isDashboardPage && user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Bookings</h1>
                <p className="text-gray-600 dark:text-gray-300">Manage your event bookings and download tickets</p>
              </div>
              {/* ADD REAL-TIME STATUS INDICATOR */}
              <div className="flex items-center gap-2">
                {isConnected && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Wifi className="h-3 w-3 text-green-500" />
                    Live Updates
                  </Badge>
                )}
                {lastUpdateTime && (
                  <Badge variant="secondary" className="text-xs">
                    Updated {lastUpdateTime.toLocaleTimeString()}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Mobile-Friendly Tab List with improved dark mode */}
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 p-1 h-auto bg-gray-100 dark:bg-gray-800">
                <TabsTrigger
                  value="all"
                  className="text-xs sm:text-sm px-1 sm:px-2 py-2 h-auto flex flex-col sm:flex-row items-center data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300"
                >
                  <span className="hidden sm:inline">All Bookings</span>
                  <span className="sm:hidden text-xs">All</span>
                  <span className="text-xs sm:ml-2">({bookings.length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="confirmed"
                  className="text-xs sm:text-sm px-1 sm:px-2 py-2 h-auto flex flex-col sm:flex-row items-center data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300"
                >
                  <span className="hidden sm:inline">Confirmed</span>
                  <span className="sm:hidden text-xs">Confirmed</span>
                  <span className="text-xs sm:ml-2">({filterBookings('confirmed').length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="text-xs sm:text-sm px-1 sm:px-2 py-2 h-auto flex flex-col sm:flex-row items-center data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300"
                >
                  <span className="hidden sm:inline">Pending</span>
                  <span className="sm:hidden text-xs">Pending</span>
                  <span className="text-xs sm:ml-2">({filterBookings('pending').length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="cancelled"
                  className="text-xs sm:text-sm px-1 sm:px-2 py-2 h-auto flex flex-col sm:flex-row items-center data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300"
                >
                  <span className="hidden sm:inline">Cancelled</span>
                  <span className="sm:hidden text-xs">Cancelled</span>
                  <span className="text-xs sm:ml-2">({filterBookings('cancelled').length})</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-4">
                  {filterBookings(activeTab).map((booking) => {
                    if (!booking || !booking.id) {
                      return null;
                    }

                    return (
                      <Card key={booking.id} className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                        <CardContent className="p-0">
                          <div className="flex flex-col lg:flex-row">
                            {/* Event Image */}
                            <div className="lg:w-48 h-48 lg:h-auto">
                              <img
                                src={booking.eventImage || '/placeholder-image.jpg'}
                                alt={booking.eventTitle || 'Event'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop';
                                }}
                              />
                            </div>

                            {/* Booking Details */}
                            <div className="flex-1 p-6">
                              <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                      {booking.eventTitle || 'Untitled Event'}
                                    </h3>
                                    {booking.category && (
                                      <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">{booking.category}</Badge>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>{formatDate(booking.eventDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      <span>{booking.eventTime || 'Time TBD'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      <span>{booking.eventLocation || 'Location TBD'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <UsersIcon className="h-4 w-4" />
                                      <span>{booking.numberOfTickets || 1} ticket{(booking.numberOfTickets || 1) > 1 ? 's' : ''}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 mt-4 lg:mt-0">
                                  <Badge className={getStatusColor(booking.status)}>
                                    {getStatusIcon(booking.status)}
                                    <span className="ml-1 capitalize">{booking.status}</span>
                                  </Badge>
                                </div>
                              </div>

                              {/* Booking Information */}
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-900 dark:text-white">Booking ID:</span>
                                    <div className="text-gray-600 dark:text-gray-300">{booking.ticketId || booking.id}</div>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900 dark:text-white">Booked on:</span>
                                    <div className="text-gray-600 dark:text-gray-300">
                                      {formatDateTime(booking.bookingDate)}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900 dark:text-white">Total Amount:</span>
                                    <div className="text-lg font-bold text-primary dark:text-primary-400">
                                      ${booking.totalAmount || 0}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Enhanced Action Buttons */}
                              <div className="space-y-2">
                                <UniversalBookingActions
                                  booking={booking}
                                  onRatingSubmit={handleRatingSubmit}
                                  onDownloadComplete={handleDownloadComplete}
                                  showToast={showToastMessage}
                                />

                                {/* Keep cancel booking functionality with better dark mode styling */}
                                {booking.status === 'pending' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:border-red-600 dark:hover:border-red-500"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    <span className="font-medium">Cancel Booking</span>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {filterBookings(activeTab).length === 0 && (
                    <div className="text-center py-12">
                      <div className="max-w-md mx-auto">
                        <Ticket className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No bookings found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {activeTab === 'all' ? "You haven't made any bookings yet. Start exploring events!" : `You don't have any ${activeTab} bookings.` }
                        </p>
                        <Button onClick={() => window.location.href = '/'} className="bg-primary hover:bg-primary/90 text-white font-medium dark:bg-primary dark:hover:bg-primary/90 dark:text-white" >
                          <span className="text-white font-medium">Browse Events</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    );
  }

  // Admin Dashboard (only accessible via /dashboard route for admin users)
  if (isDashboardPage && user.role === 'admin') {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        {/* Fixed container with proper mobile padding */}
        <div className="flex-grow max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300">Manage your events, users, and view analytics</p>
              </div>
              {/* ADD ADMIN REAL-TIME INDICATORS */}
              <div className="flex items-center gap-2">
                {isConnected && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Wifi className="h-3 w-3 text-green-500" />
                    Real-time Dashboard
                  </Badge>
                )}
                {realTimeNotifications.length > 0 && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    {realTimeNotifications.length} New
                  </Badge>
                )}
              </div>
            </div>

            {/* ADD REAL-TIME NOTIFICATIONS PANEL */}
            {realTimeNotifications.length > 0 && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-1">
                    <Bell className="h-4 w-4" />
                    Recent Activity
                  </h3>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {realTimeNotifications.slice(0, 5).map(notification => (
                      <div key={notification.id} className="text-sm text-gray-600 dark:text-gray-300 flex items-center justify-between">
                        <span>{notification.message}</span>
                        <span className="text-xs">{notification.time.toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <Tabs defaultValue="overview" className="space-y-6">
            {/* Mobile-responsive tab list with improved dark mode */}
            <TabsList className="grid w-full grid-cols-3 h-auto bg-gray-100 dark:bg-gray-800">
              <TabsTrigger 
                value="overview" 
                className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300 font-medium"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300 font-medium"
              >
                Events
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300 font-medium"
              >
                Users
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Overview onCreateEvent={() => setIsCreateModalOpen(true)} />
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <Events />
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Users />
            </TabsContent>
          </Tabs>
        </div>
        <EnhancedFooter />
      </div>
    );
  }

  return null; 
};

export default Dashboard;