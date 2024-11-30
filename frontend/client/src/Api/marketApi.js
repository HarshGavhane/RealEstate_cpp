import axios from 'axios';

const API_BASE_URL = 'https://api.example.com';

export const fetchMarketTrends = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/market-trends`);
    return response.data;
  } catch (error) {
    console.error("Error fetching market trends", error);
    throw error;
  }
};

export const fetchUserPreferences = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/preferences`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user preferences", error);
    throw error;
  }
};

// Add more functions as needed for Alerts and User Preferences
