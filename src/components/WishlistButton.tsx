import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';

interface WishlistButtonProps {
  eventId: string;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  eventId, 
  size = 'default',
  className = ''
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const inWishlist = isInWishlist(eventId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleWishlist(eventId);
    
    toast({
      title: inWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: inWishlist 
        ? "Event removed from your wishlist" 
        : "Event added to your wishlist",
    });
  };

  return (
    <Button
      variant={inWishlist ? "default" : "outline"}
      size={size === 'sm' ? 'sm' : 'icon'}
      onClick={handleToggle}
      className={`${inWishlist ? 'bg-red-500 hover:bg-red-600 text-white' : 'text-gray-500 hover:text-red-600'} ${className}`}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
    </Button>
  );
};

export default WishlistButton;