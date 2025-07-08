import useAuthStore from "@/store/authStore";

export const checkAndValidateAuth = () => {
  if (typeof window === "undefined") return false;
  
  try {
    const { initializeAuth } = useAuthStore.getState();
    return initializeAuth();
  } catch (error) {
    console.error("Auth validation failed:", error);
    // Clear any corrupted state
    try {
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("token");
      sessionStorage.clear();
    } catch (storageError) {
      console.warn("Storage cleanup failed:", storageError);
    }
    return false;
  }
};

export const clearAllAuthData = () => {
  if (typeof window === "undefined") return;
  
  try {
    // Clear Zustand store
    const { logout } = useAuthStore.getState();
    logout();
    
    // Clear all storage
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("token");
    sessionStorage.clear();
    
    // Clear cookies via API
    fetch("/api/remove-cookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch(error => {
      console.warn("Cookie removal failed:", error);
    });
    
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
}; 