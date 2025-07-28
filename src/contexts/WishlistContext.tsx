import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (eventId: string) => void;
  removeFromWishlist: (eventId: string) => void;
  isInWishlist: (eventId: string) => boolean;
  toggleWishlist: (eventId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const addToWishlist = (eventId: string) => {
    setWishlist(prev => [...prev, eventId]);
  };

  const removeFromWishlist = (eventId: string) => {
    setWishlist(prev => prev.filter(id => id !== eventId));
  };

  const isInWishlist = (eventId: string) => wishlist.includes(eventId);

  const toggleWishlist = (eventId: string) => {
    if (isInWishlist(eventId)) {
      removeFromWishlist(eventId);
    } else {
      addToWishlist(eventId);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};