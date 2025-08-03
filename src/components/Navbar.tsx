// src/components/Navbar.tsx - With WebSocket status added
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, User, LogOut, Settings, Ticket, Heart, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { WebSocketStatus } from '@/components/WebSocketStatus';
import ThemeToggle from '@/components/ThemeToggle';
import MobileNavigation from '@/components/MobileNavigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get booking count from localStorage
  const getBookingCount = () => {
    if (!user) return 0;
    const savedBookings = localStorage.getItem(`bookings_${user.id}`);
    if (savedBookings) {
      try {
        const bookings = JSON.parse(savedBookings);
        return bookings.filter((booking: any) => booking.status === 'confirmed').length;
      } catch {
        return 0;
      }
    }
    return 0;
  };

  const bookingCount = getBookingCount();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">EventHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              Events
            </Link>
            <Link
              to="/wishlist"
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1"
            >
              <Heart className="h-4 w-4" />
              Wishlist
              {wishlist.length > 0 && (
                <span className="bg-primary text-white text-xs rounded-full px-2 py-1 ml-1">
                  {wishlist.length}
                </span>
              )}
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-bookings"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1"
              >
                <Ticket className="h-4 w-4" />
                My Bookings
                {bookingCount > 0 && (
                  <span className="bg-primary text-white text-xs rounded-full px-2 py-1 ml-1">
                    {bookingCount}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link 
                to="/dashboard" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side content */}
          <div className="flex items-center space-x-4">
            {/* WebSocket Status - ADD THIS */}
            {isAuthenticated && <WebSocketStatus />}
            
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Desktop Auth Section */}
            {isAuthenticated ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>
                      <span className="font-medium">{user?.name}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <UserCircle className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist">
                        <Heart className="w-4 h-4 mr-2" />
                        Wishlist
                        {wishlist.length > 0 && (
                          <span className="bg-primary text-white text-xs rounded-full px-2 py-1 ml-auto">
                            {wishlist.length}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-bookings">
                        <Ticket className="w-4 h-4 mr-2" />
                        My Bookings
                        {bookingCount > 0 && (
                          <span className="bg-primary text-white text-xs rounded-full px-2 py-1 ml-auto">
                            {bookingCount}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile Navigation */}
            <MobileNavigation />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;