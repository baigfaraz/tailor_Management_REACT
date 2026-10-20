import axios from "axios";

// Same-origin by default: in production the API server also serves this app,
// and in development the CRA dev server proxies /api (see "proxy" in package.json).
// REACT_APP_API_BASE can point at another server, e.g. http://192.168.1.10:5000.
const client = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE || ""}/api`,
});

export default client;
