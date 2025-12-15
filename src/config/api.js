// API Configuration - automatically detects the correct API URL
const getApiBaseUrl = () => {
  // Check for environment variable override first
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // If we're in a browser environment
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    
    // For ngrok or other hosted environments, use the same origin
    // This assumes your backend is accessible via the same ngrok URL
    if (origin.includes('ngrok') || origin.includes('ngrok-free.app') || origin.includes('ngrok.io') || origin.includes('ngrok-free.dev')) {
      // For ngrok, use the same origin (backend should be proxied/tunneled through ngrok)
      return origin;
    }
    
    // For localhost development, use localhost:8000 (backend port)
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      const backendPort = process.env.REACT_APP_API_PORT || '8000';
      // Extract hostname (localhost or 127.0.0.1)
      const url = new URL(origin);
      const hostname = url.hostname;
      return `http://${hostname}:${backendPort}`;
    }
    
    // For production or other environments, use same origin
    return origin;
  }
  
  // Fallback for server-side rendering
  return 'http://127.0.0.1:8000';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to build API URLs
export const apiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // If endpoint already starts with /api, use it directly
  if (cleanEndpoint.startsWith('/api')) {
    return `${API_BASE_URL}${cleanEndpoint}`;
  }
  
  // Otherwise, prepend /api
  return `${API_BASE_URL}/api${cleanEndpoint}`;
};

export default API_BASE_URL;

