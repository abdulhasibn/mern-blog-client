export const getBackendUrl = () => {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
  return import.meta.env.MODE === "development" ? "" : backendBaseUrl;
};
