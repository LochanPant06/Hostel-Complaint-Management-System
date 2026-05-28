import apiClient from "../utils/apiClient.js";

export const authService = {
  register: async (data) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post("/auth/refresh-token", {
      refreshToken,
    });
    return response.data;
  },
};

export const complaintService = {
  createComplaint: async (data) => {
    const response = await apiClient.post("/complaints", data);
    return response.data;
  },

  getMyComplaints: async (params) => {
    const response = await apiClient.get("/complaints/my", { params });
    return response.data;
  },

  getAllComplaints: async (params) => {
    const response = await apiClient.get("/complaints/all", { params });
    return response.data;
  },

  getComplaintById: async (id) => {
    const response = await apiClient.get(`/complaints/${id}`);
    return response.data;
  },

  updateComplaint: async (id, data) => {
    const response = await apiClient.put(`/complaints/${id}`, data);
    return response.data;
  },

  deleteComplaint: async (id) => {
    const response = await apiClient.delete(`/complaints/${id}`);
    return response.data;
  },

  getStats: async (params) => {
    const response = await apiClient.get("/complaints/stats", { params });
    return response.data;
  },
};

export const userService = {
  getCurrentUser: async () => {
    const response = await apiClient.get("/users/me");
    return response.data;
  },

  getAllUsers: async (params) => {
    const response = await apiClient.get("/users", { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.patch("/users/profile", data);
    return response.data;
  },

  deactivateAccount: async () => {
    const response = await apiClient.delete("/users/deactivate");
    return response.data;
  },
};
