import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const localENV = "http://localhost:8000";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log(mode, "modelm");
  return {
    server: {
      proxy: {
        "/api": localENV,
      },
    },
    plugins: [react()],
  };
});
