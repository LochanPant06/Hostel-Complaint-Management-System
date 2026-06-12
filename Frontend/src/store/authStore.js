import { create } from "zustand";
import { persist } from "zustand/middleware";

const normalizeApiUrl = (url) => {
  if (!url) return url;
  let normalized = url.trim().replace(/\/+$/, "");
  if (!normalized.endsWith("/api/v1")) {
    normalized += "/api/v1";
  }
  return normalized;
};

const API_BASE_URL =
  normalizeApiUrl(import.meta.env.VITE_API_BASE_URL) || "/api/v1";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      parseErrorMessage: async (response, fallback) => {
        try {
          const errorData = await response.json();
          return errorData?.message || fallback;
        } catch {
          return fallback;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error(
              await get().parseErrorMessage(response, "Login failed"),
            );
          }

          const text = await response.text();
          const data = text ? JSON.parse(text) : null;
          if (!data) {
            throw new Error("Empty response from server");
          }

          set({
            user: data.data.user,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
            isLoading: false,
          });

          localStorage.setItem("accessToken", data.data.accessToken);
          localStorage.setItem("refreshToken", data.data.refreshToken);
          localStorage.setItem("user", JSON.stringify(data.data.user));

          return data;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            throw new Error(
              await get().parseErrorMessage(response, "Registration failed"),
            );
          }

          const text = await response.text();
          const data = text ? JSON.parse(text) : null;
          if (!data) {
            throw new Error("Empty response from server");
          }

          set({
            user: data.data.user,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
            isLoading: false,
          });

          localStorage.setItem("accessToken", data.data.accessToken);
          localStorage.setItem("refreshToken", data.data.refreshToken);
          localStorage.setItem("user", JSON.stringify(data.data.user));

          return data;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          const token = get().accessToken;
          if (token) {
            await fetch(`${API_BASE_URL}/auth/logout`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
            });
          }
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
          });
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      },

      isAuthenticated: () => {
        return !!get().accessToken && !!get().user;
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
