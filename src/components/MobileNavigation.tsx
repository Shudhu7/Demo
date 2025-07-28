import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Calendar, User, LogOut, Settings, Ticket, Menu, Heart, Home, UserCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const MobileNavigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlist } = useWishlist();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
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
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <div className="py-6">
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                <Calendar className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">EventHub</span>
              </Link>
              <ThemeToggle />
            </div>

            <nav className="space-y-2">
              <Link
                to="/"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>

              <Link
                to="/wishlist"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/wishlist' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Heart className="h-5 w-5" />
                <span>Wishlist</span>
                {wishlist.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {wishlist.length}
                  </Badge>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-bookings"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === '/my-bookings' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Ticket className="h-5 w-5" />
                    <span>My Bookings</span>
                    {bookingCount > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {bookingCount}
                      </Badge>
                    )}
                  </Link>

                  {/* Added Profile Link */}
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === '/profile' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <UserCircle className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>

                  {user?.role === 'admin' && (
                    <Link
                      to="/dashboard"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname === '/dashboard' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <div className="border-t pt-4 mt-4">
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Signed in as {user?.name}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t pt-4 mt-4 space-y-2">
                  <Link
                    to="/login"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary text-primary-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;