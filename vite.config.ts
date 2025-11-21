import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Прокси для HuggingFace API чтобы обойти CORS
      '/api/huggingface': {
        target: 'https://router.huggingface.co',
        changeOrigin: true,
        rewrite: (path) => {
          // Убираем /api/huggingface и добавляем /generate к пути модели
          const newPath = path.replace(/^\/api\/huggingface\/models\/([^\/]+)(\/.*)?/, '/models/$1/generate');
          console.log('Rewriting path:', path, '->', newPath);
          return newPath;
        },
        secure: true,
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
