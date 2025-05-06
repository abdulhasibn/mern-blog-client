import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const localENV = "http://localhost:8000";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    server: {
      proxy: {
        "/api": mode === "development" ? localENV : process.env.VITE_API_URL,
      },
    },
    plugins: [react()],
  };
});
