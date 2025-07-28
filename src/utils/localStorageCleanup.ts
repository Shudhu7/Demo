
/**
 * Utility function to clean up localStorage and ensure proper user isolation
 * This should be called when the app starts to migrate from old data structure
 */
export const cleanupLocalStorage = () => {
  try {
    // Get current user if logged in
    const currentUserData = localStorage.getItem('user');
    const currentToken = localStorage.getItem('token');
    
    // Remove old booking data that might be using the generic user ID '1'
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('bookings_')) {
        keysToRemove.push(key);
      }
    }
    
    // Remove old booking keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // If there's a current user, make sure their booking data is properly initialized
    if (currentUserData && currentToken) {
      try {
        const user = JSON.parse(currentUserData);
        // Initialize empty bookings array for the current user if it doesn't exist
        const userBookingsKey = `bookings_${user.id}`;
        if (!localStorage.getItem(userBookingsKey)) {
          localStorage.setItem(userBookingsKey, JSON.stringify([]));
        }
      } catch (error) {
        console.error('Error parsing current user data during cleanup:', error);
      }
    }
    
    console.log('LocalStorage cleanup completed successfully');
  } catch (error) {
    console.error('Error during localStorage cleanup:', error);
  }
};

/**
 * Initialize user-specific storage when a user logs in
 */
export const initializeUserStorage = (userId: string) => {
  const userBookingsKey = `bookings_${userId}`;
  
  // Only initialize if no bookings exist for this user
  if (!localStorage.getItem(userBookingsKey)) {
    localStorage.setItem(userBookingsKey, JSON.stringify([]));
  }
};

/**
 * Clear all user-specific data when logging out
 */
export const clearUserStorage = (userId: string) => {
  const userBookingsKey = `bookings_${userId}`;
  localStorage.removeItem(userBookingsKey);
};