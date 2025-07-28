import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = '/placeholder-event.jpg',
  className,
  onLoad,
  onError
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
    setIsLoading(false);
    onError?.();
  };

  if (hasError) {
    return (
      <div className={cn("bg-gray-200 dark:bg-gray-700 flex items-center justify-center", className)}>
        <span className="text-gray-400 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={cn("absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse", className)} />
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={cn(className, isLoading ? 'opacity-0' : 'opacity-100')}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};