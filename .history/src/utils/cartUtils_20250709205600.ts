// Utility function to clear all cart-related data from localStorage
export const clearAllCartDataFromStorage = () => {
  try {
    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    
    // Remove all keys that start with "gear-shop-cart-"
    keys.forEach(key => {
      if (key.startsWith("gear-shop-cart-")) {
        localStorage.removeItem(key);
      }
    });
    
    // Also remove the old global cart key if it exists
    localStorage.removeItem("gear-shop-cart");
    
    console.log("Cleared all cart data from localStorage");
  } catch (error) {
    console.error("Error clearing cart data from localStorage:", error);
  }
};

// Get cart storage key for a specific user
export const getCartStorageKey = (userId?: number | null) => {
  if (userId) {
    return `gear-shop-cart-user-${userId}`;
  }
  return "gear-shop-cart-guest";
}; 