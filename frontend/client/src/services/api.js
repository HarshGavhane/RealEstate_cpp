import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api"; // Adjust if needed

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch preferences for a specific user by userId
export const fetchPreferences = async (userId) => {
  const response = await apiClient.get(`/preferences/${userId}`);
  return response.data;
};

// Update preferences for a specific user by userId
export const updatePreference = async (userId, data) => {
  const response = await apiClient.put(`/preferences/${userId}`, data);
  return response.data;
};

// Create new preferences for a user
export const createPreference = async (userId, data) => {
  const response = await apiClient.post(`/preferences/${userId}`, data);
  return response.data;
};

// Delete preferences for a specific user by userId
export const deletePreference = async (userId) => {
  const response = await apiClient.delete(`/preferences/${userId}`);
  return response.data;
};

// You can implement fetchRegionsFromAPI here if needed
export const fetchRegionsFromAPI = async () => {
  const response = await apiClient.get("/regions");
  return response.data;
};

export default apiClient;
