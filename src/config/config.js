// Configuration variables
const config = {
  // API related
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api",

  // Authentication related
  tokenKey: "token",
  userKey: "user",

  // Application settings
  appName: "Cozy Glam",
  defaultPageSize: 10,
};

export default config;
