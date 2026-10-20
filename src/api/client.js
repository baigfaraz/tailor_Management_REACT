import axios from "axios";

// Same-origin by default: in production the API server also serves this app,
// and in development the CRA dev server proxies /api (see "proxy" in package.json).
// REACT_APP_API_BASE can point at another server, e.g. http://192.168.1.10:5000
// (that origin must then be listed in the server's CORS_ORIGINS).
const client = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE || ""}/api`,
  withCredentials: true,
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
