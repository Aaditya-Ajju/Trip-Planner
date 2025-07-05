// API Configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5000/api',
    timeout: 10000
  },
  production: {
    baseURL: import.meta.env.VITE_API_URL || 'https://trip-planner-3bov.onrender.com/api',
    timeout: 15000
  }
};

// Get current environment
const isDevelopment = import.meta.env.DEV;
const config = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

// API helper functions
export const apiCall = async (endpoint, options = {}) => {
  const url = `${config.baseURL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    timeout: config.timeout,
    ...options
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Specific API functions
export const api = {
  // Cities
  getCityInsights: (city) => apiCall(`/cities/insights?city=${encodeURIComponent(city)}`),
  
  // Trips
  getTrips: () => apiCall('/trips'),
  createTrip: (tripData) => apiCall('/trips', {
    method: 'POST',
    body: JSON.stringify(tripData)
  }),
  updateTrip: (tripId, tripData) => apiCall(`/trips/${tripId}`, {
    method: 'PUT',
    body: JSON.stringify(tripData)
  }),
  deleteTrip: (tripId) => apiCall(`/trips/${tripId}`, {
    method: 'DELETE'
  }),
  
  // Users
  getUserProfile: (userId) => apiCall(`/users/${userId}`),
  updateUserProfile: (userId, userData) => apiCall(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),
  
  // Weather
  getWeather: (city) => apiCall(`/weather?city=${encodeURIComponent(city)}`),
  
  // Health check
  healthCheck: () => apiCall('/health')
};

export default api; 
