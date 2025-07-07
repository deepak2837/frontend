import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import CryptoJS from "crypto-js"; // ✅ Import crypto-js

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "mysecretkey"; // ✅ Use an environment variable for security

// Encrypt function
const encryptData = (data) => {
  if (!data) return null;
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Decrypt function
const decryptData = (ciphertext) => {
  if (!ciphertext) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      otpSent: false,
      token: "",
      phoneNumber: "",

      // Initialize and validate auth state
      initializeAuth: () => {
        const state = get();
        const token = state.token;
        
        if (token) {
          try {
            const decryptedToken = decryptData(token);
            if (!decryptedToken) {
              // Invalid token, clear everything
              set({
                isAuthenticated: false,
                user: null,
                token: "",
                phoneNumber: "",
                otpSent: false,
                error: null,
              });
              localStorage.removeItem("auth-storage");
              return false;
            }
            return true;
          } catch (error) {
            console.error("Token validation failed:", error);
            // Clear invalid state
            set({
              isAuthenticated: false,
              user: null,
              token: "",
              phoneNumber: "",
              otpSent: false,
              error: null,
            });
            localStorage.removeItem("auth-storage");
            return false;
          }
        }
        return false;
      },

      // Set phone number in the store
      setPhoneNumber: (mobileNumber) => set({ phoneNumber: mobileNumber }),

      // Request OTP
      requestOTP: async (mobileNumber) => {
        set({ isLoading: true, error: null });

        try {
          console.log("reach");
          try {
            const response = await axios.post(
              `${BASE_URL}/api/v1/auth/send-otp`,
              { mobileNumber }
            );
            response.isLoading = false;
            set({
              isLoading: false,
              otpSent: true,
              phoneNumber: mobileNumber,
            });

            return response.data;
          } catch (axiosError) {
            console.log("Axios error:eqrwthyjuiytre");
            if (axiosError.response && axiosError.response.status === 302) {
              console.warn(
                "Redirecting due to 302 response:",
                axiosError.response.data.redirect
              );
              set({
                isLoading: false,
                error:
                  axiosError.response.data.redirect || "Redirection occurred",
              });
              return axiosError.response.data.redirect; // Stop further execution
            }

            console.error("Error during OTP request:", axiosError.message);
            throw axiosError; // Re-throw to handle it in the outer catch block
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to send OTP",
          });

          return false;
        }
      },

      // Verify OTP
      verifyOTP: async (otp) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post(
            `${BASE_URL}/api/v1/auth/verify-otp`,
            {
              mobileNumber: get().phoneNumber, // ✅ Get phone number from store
              otp,
            }
          );

          const token = response.data.token;
          await fetch("/api/set-cookie", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          // Encrypt data before storing it
          const encryptedUser = encryptData(response.data.user);
          const encryptedToken = encryptData(response.data.token);

          set({
            isLoading: false,
            isAuthenticated: true,
            user: encryptedUser, // Store encrypted user data
            otpSent: false,
            token: encryptedToken, // Store encrypted token
          });

          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Invalid OTP",
          });

          return false;
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true });

        try {
          const token = decryptData(get().token); // Decrypt token before sending request

          // Try to call backend logout (don't fail if it doesn't work)
          try {
            await axios.post(
              `${BASE_URL}/api/v1/auth/logout`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } catch (backendError) {
            console.warn("Backend logout failed, continuing with frontend cleanup:", backendError);
          }

          // Clear cookie
          try {
            await fetch("/api/remove-cookie", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });
          } catch (cookieError) {
            console.warn("Cookie removal failed:", cookieError);
          }

          // Reset state first
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            otpSent: false,
            phoneNumber: "",
            error: null,
            token: "",
          });

          // Clear localStorage after state reset
          try {
            localStorage.removeItem("auth-storage");
            // Also clear any other auth-related items
            localStorage.removeItem("token");
            sessionStorage.clear();
          } catch (storageError) {
            console.warn("Storage cleanup failed:", storageError);
          }

          // Force page reload to ensure complete cleanup
          window.location.href = "/login";

          return true;
        } catch (error) {
          console.error("Logout error:", error);
          // Even if there's an error, try to reset state
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            otpSent: false,
            phoneNumber: "",
            error: null,
            token: "",
          });
          
          // Clear storage and redirect anyway
          try {
            localStorage.removeItem("auth-storage");
            localStorage.removeItem("token");
            sessionStorage.clear();
          } catch (storageError) {
            console.warn("Storage cleanup failed:", storageError);
          }
          
          window.location.href = "/login";
          return false;
        }
      },

      // Clear errors
      clearError: () => set({ error: null }),

      // Get decrypted user data
      getUser: () => {
        return decryptData(get().user);
      },

      // Get decrypted token
      getToken: () => {
        const token = decryptData(get().token);
        if (token) {
          try {
            // Check if token is expired (basic check)
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp && payload.exp * 1000 < Date.now()) {
              console.warn("Token expired, logging out...");
              get().logout();
              return null;
            }
          } catch (error) {
            console.error("Token validation error:", error);
            get().logout();
            return null;
          }
        }
        return token;
      },

      // Login with password
      loginWithPassword: async (mobileNumber, password) => {
        set({ isLoading: true, error: null });

        try {
          console.log("Sending login request with mobileNumber:", mobileNumber);
          const response = await axios.post(
            `${BASE_URL}/api/v1/auth/login`,
            { mobileNumber, password }
          );

          const token = response.data.token;
          await fetch("/api/set-cookie", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          // Encrypt data before storing it
          const encryptedUser = encryptData(response.data.user);
          const encryptedToken = encryptData(response.data.token);

          set({
            isLoading: false,
            isAuthenticated: true,
            user: encryptedUser,
            token: encryptedToken,
            phoneNumber: mobileNumber,
          });

          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Login failed",
          });

          return false;
        }
      },

      // Update user in store and persist
      updateUser: (newUser) => {
        const encryptedUser = encryptData(newUser);
        set({ user: encryptedUser });
        // Also update the persisted storage
        localStorage.setItem(
          "auth-storage",
          JSON.stringify({
            state: {
              ...useAuthStore.getState(),
              user: encryptedUser,
            },
            version: 0,
          })
        );
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
