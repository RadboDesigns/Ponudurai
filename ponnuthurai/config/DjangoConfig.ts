// config/DjangoConfig.js
export const BACKEND_URL = 'http://192.168.1.2:8000'; // Use your local IP address

export const API_CONFIG = {
  ENDPOINTS: {
    LIVE_PRICES: '/live_prices/', // Update this to match your Django URL pattern
    USER: '/user/',
    FEEDS: '/Feeds/',
    CHECK_USER: '/user/check/',
  },
  REFRESH_INTERVAL: 3600000, // Refresh every minute (adjust as needed)
};