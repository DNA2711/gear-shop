// Utility để làm sạch localStorage khỏi dữ liệu bị corrupt
export function cleanLocalStorage() {
  if (typeof window === "undefined") return;

  const keysToCheck = ["auth-token", "user-data", "cart-data"];

  keysToCheck.forEach((key) => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        // Kiểm tra nếu item không phải string hợp lệ
        if (typeof item !== "string") {
          console.warn(`Removing invalid localStorage item: ${key}`);
          localStorage.removeItem(key);
        }
        // Nếu key chứa "data" thì cố gắng parse JSON để kiểm tra
        if (key.includes("data")) {
          try {
            JSON.parse(item);
          } catch (e) {
            console.warn(`Removing corrupted JSON in localStorage: ${key}`);
            localStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error(`Error checking localStorage key "${key}":`, error);
      try {
        localStorage.removeItem(key);
      } catch (removeError) {
        console.error(`Error removing localStorage key "${key}":`, removeError);
      }
    }
  });
}

// Gọi function này khi app khởi động
if (typeof window !== "undefined") {
  cleanLocalStorage();
}
