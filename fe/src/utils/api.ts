import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Simple in-memory cache for GET requests and specific POST requests
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Utility function to clear cache
export const clearCache = () => {
  cache.clear();
  console.log('Cache cleared');
};

// Utility function to get cache stats
export const getCacheStats = () => {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
};

// Helper function to generate consistent cache key
const generateCacheKey = (method: string, url: string, data?: any, params?: any) => {
  if (method === 'get') {
    return `${url}${JSON.stringify(params || {})}`;
  } else {
    // For POST requests, ensure we always stringify the data object consistently
    const dataToStringify = typeof data === 'string' ? JSON.parse(data) : data;
    return `${method}:${url}:${JSON.stringify(dataToStringify || {})}`;
  }
};

// Request interceptor to add caching for GET requests and specific POST requests
apiClient.interceptors.request.use(
  (config) => {
    // Cache GET requests and POST requests to /repo endpoint
    if (config.method === 'get' || (config.method === 'post' && config.url === '/repo')) {
      const cacheKey = generateCacheKey(config.method!, config.url!, config.data, config.params);
      
      const cachedResponse = cache.get(cacheKey);
      
      if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_TTL) {
        // Return cached response
        return Promise.reject({
          __cached: true,
          data: cachedResponse.data,
        });
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle caching and errors
apiClient.interceptors.response.use(
  (response) => {
    // Cache GET responses and POST responses to /repo endpoint
    if (response.config.method === 'get' || (response.config.method === 'post' && response.config.url === '/repo')) {
      const cacheKey = generateCacheKey(response.config.method!, response.config.url!, response.config.data, response.config.params);
      
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
      
    }
    
    return response;
  },
  (error) => {
    // Handle cached responses
    if (error.__cached) {
      return Promise.resolve({ data: error.data });
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API functions
export const fetchRepoData = async (owner: string, repo: string) => {
  try {
    const response = await apiClient.post('/repo', {
      owner,
      repo,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching repo data:', error);
    throw error;
  }
};

export default apiClient; 