export const clearAllCartDataFromStorage = () => {
  try {
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith("gear-shop-cart-")) {
        localStorage.removeItem(key);
      }
    });
    
    localStorage.removeItem("gear-shop-cart");
    
    console.log("Cleared all cart data from localStorage");
  } catch (error) {
    console.error("Error clearing cart data from localStorage:", error);
  }
};
export const getCartStorageKey = (userId?: number | null) => {
  if (userId) {
    return `gear-shop-cart-user-${userId}`;
  }
  return "gear-shop-cart-guest";
}; 