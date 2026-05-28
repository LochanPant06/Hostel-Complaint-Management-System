import { useAuthStore } from "../store/authStore.js";

export const useAuth = () => {
  const {
    user,
    accessToken,
    isLoading,
    error,
    login,
    logout,
    register,
    isAuthenticated,
  } = useAuthStore();

  return {
    user,
    accessToken,
    token: accessToken,
    isLoading,
    error,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
    register,
  };
};
