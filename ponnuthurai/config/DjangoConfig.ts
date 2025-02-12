import { Platform } from 'react-native';

// Function to get the appropriate backend URL based on platform and environment
const getDevelopmentURL = () => {
  if (Platform.OS === 'ios') {
    return Platform.select({
      ios: 'http://localhost:8000',  // iOS simulator
      default: 'http://192.168.1.X:8000',  // Replace X with your local IP
    });
  } else if (Platform.OS === 'android') {
    return Platform.select({
      android: 'http://10.0.2.2:8000',  // Android emulator
      default: 'http://192.168.1.X:8000',  // Replace X with your local IP
    });
  }
  return 'http://localhost:8000';
};

const DEV_BACKEND_URL = getDevelopmentURL();
const PROD_BACKEND_URL = 'https://your-production-backend.com';

export const BACKEND_URL = __DEV__ ? DEV_BACKEND_URL : PROD_BACKEND_URL;

export const API_CONFIG = {
  REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes in milliseconds
  ENDPOINTS: {
    LIVE_PRICES: '/live_prices/',
    AUTH: {
      LOGIN: '/auth/login/',
      LOGOUT: '/auth/logout/',
    }
  },
  TIMEOUT: 10000, // 10 seconds timeout
};

// Helper function to check network connectivity;