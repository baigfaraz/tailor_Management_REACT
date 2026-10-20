import axios from "axios";

// Same-origin by default: in production the API server also serves this app,
// and in development the Vite dev server proxies /api (see vite.config.js).
// VITE_API_BASE can point at another server, e.g. http://192.168.1.10:5000
// (that origin must then be listed in the server's CORS_ORIGINS).
const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE || ""}/api`,
  withCredentials: true,
  // A dead Wi-Fi link should end in an error message, not an endless wait.
  timeout: 15000,
});

export const DEVICE_LOCKED_EVENT = "tailor:device-locked";

// Any 401 means this device lost its PIN cookie (e.g. the shop PIN changed).
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event(DEVICE_LOCKED_EVENT));
    }
    return Promise.reject(error);
  },
);

export default client;
