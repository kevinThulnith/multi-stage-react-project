import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [react(), tailwindcss()],
    define: {
      "process.env.API_KEY": JSON.stringify(env.VITE_GEMINI_API_KEY),
      "process.env.VITE_GEMINI_API_KEY": JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  };
});
