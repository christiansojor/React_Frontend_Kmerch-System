// API Configuration - automatically detects the correct API URL
// 
// For ngrok frontend + localhost backend (desktop):
// - Frontend accessed via ngrok (e.g., https://xxx.ngrok-free.dev)
// - Backend on localhost:8000 (accessible from desktop browser)
// - API calls will use http://localhost:8000
//
// For ngrok frontend + ngrok backend (mobile):
// - Set REACT_APP_API_BASE_URL to your backend ngrok URL
//
const getApiBaseUrl = () => {
  // Check for environment variable override first (PRIORITY - for mobile/separate backend ngrok)
  if (process.env.REACT_APP_API_BASE_URL) {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    console.log('[API Config] Using REACT_APP_API_BASE_URL:', apiBaseUrl);
    
    // Warn if the API URL matches the current origin (likely a mistake - using frontend URL instead of backend)
    // BUT: If both are ngrok URLs, this might be valid if ngrok routes both through the same URL
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin;
      const isNgrokUrl = apiBaseUrl.includes('ngrok') || currentOrigin.includes('ngrok');
      
      if (apiBaseUrl === currentOrigin || apiBaseUrl.replace(/\/$/, '') === currentOrigin.replace(/\/$/, '')) {
        if (isNgrokUrl) {
          // Both are ngrok URLs - this might be valid if ngrok routes both through same URL
          console.warn('[API Config] ⚠️ NOTE: REACT_APP_API_BASE_URL matches frontend URL.');
          console.warn('[API Config] This can work if ngrok routes /api/* to backend. Testing...');
          console.warn('[API Config] If you get 404 errors, you need separate ngrok URLs for frontend and backend.');
        } else {
          // Not ngrok - this is definitely wrong
          console.error('[API Config] ⚠️ WARNING: REACT_APP_API_BASE_URL matches current frontend URL!');
          console.error('[API Config] This is likely incorrect. The API base URL should point to your BACKEND server, not the frontend.');
          console.error('[API Config] Current frontend URL:', currentOrigin);
          console.error('[API Config] Configured API URL:', apiBaseUrl);
          console.error('[API Config] For ngrok setup:');
          console.error('[API Config]   1. Start ngrok for backend: ngrok http 8000');
          console.error('[API Config]   2. Copy the backend ngrok URL (e.g., https://xxx.ngrok-free.dev)');
          console.error('[API Config]   3. Set REACT_APP_API_BASE_URL to that backend URL in frontend/.env');
          console.error('[API Config]   4. Restart React dev server');
        }
      }
    }
    
    return apiBaseUrl;
  }
  
  // Check localStorage for manually set API URL (useful for testing)
  if (typeof window !== 'undefined') {
    const storedApiUrl = localStorage.getItem('API_BASE_URL');
    if (storedApiUrl) {
      console.log('[API Config] Using stored API URL from localStorage:', storedApiUrl);
      return storedApiUrl;
    }
  }
  
  // If we're in a browser environment
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    console.log('[API Config] Current origin:', origin);
    
    // For ngrok or other hosted environments
    const isNgrok = origin.includes('ngrok') || 
                    origin.includes('ngrok-free.app') || 
                    origin.includes('ngrok.io') || 
                    origin.includes('ngrok-free.dev');
    
    if (isNgrok) {
      // When frontend is on ngrok, check if we have a backend ngrok URL configured
      // If REACT_APP_API_BASE_URL is set, use it (for separate backend ngrok URL)
      if (process.env.REACT_APP_API_BASE_URL) {
        console.log('[API Config] Using backend ngrok URL:', process.env.REACT_APP_API_BASE_URL);
        return process.env.REACT_APP_API_BASE_URL;
      }
      
      // Use same origin (proxy mode) - React dev server will proxy /api/* to localhost:8000
      // This works on all devices because the proxy happens server-side!
      console.log('[API Config] Frontend on ngrok - using proxy mode (same origin)');
      console.log('[API Config] React dev server will proxy /api/* requests to localhost:8000');
      console.log('[API Config] This works on mobile devices too!');
      return origin;
    }
    
    // For localhost development, use localhost:8000 (backend port)
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      const backendPort = process.env.REACT_APP_API_PORT || '8000';
      const url = new URL(origin);
      const hostname = url.hostname;
      const apiUrl = `http://${hostname}:${backendPort}`;
      console.log('[API Config] Detected localhost, using:', apiUrl);
      return apiUrl;
    }
    
    // For production or other environments, use same origin
    console.log('[API Config] Using same origin:', origin);
    return origin;
  }
  
  // Fallback for server-side rendering
  console.log('[API Config] Fallback to localhost:8000');
  return 'http://127.0.0.1:8000';
};

export const API_BASE_URL = getApiBaseUrl();
console.log('[API Config] Final API_BASE_URL:', API_BASE_URL);

// Helper function to build API URLs
export const apiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // If endpoint already starts with /api, use it directly
  let finalUrl;
  if (cleanEndpoint.startsWith('/api')) {
    finalUrl = `${API_BASE_URL}${cleanEndpoint}`;
  } else {
    // Otherwise, prepend /api
    finalUrl = `${API_BASE_URL}/api${cleanEndpoint}`;
  }
  
  console.log('[API Config] apiUrl called:', { endpoint, cleanEndpoint, finalUrl });
  return finalUrl;
};

export default API_BASE_URL;

