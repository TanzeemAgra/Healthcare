import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseUrl = mode === "production" ? env.PUBLIC_URL || "/" : "/";

  return {
    base: baseUrl,
    plugins: [
      react({
        babel: {
          plugins: ['styled-jsx/babel']
        }
      })
    ],
    server: {
      host: "0.0.0.0", // This allows external connections
      port: 5173,
      strictPort: true,
      hmr: {
        port: 5173,
      },
      proxy: mode === 'development' ? {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        }
      } : {}
    },
    build: {
      outDir: "dist", // Changed from 'build' to 'dist' for Vercel
      sourcemap: mode !== "production", // Only generate sourcemaps in development
      minify: "esbuild", // Use esbuild for faster minification
      target: "es2015", // Support older browsers
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor chunks for better caching
            vendor: ["react", "react-dom"],
            bootstrap: ["bootstrap", "react-bootstrap"],
            icons: ["@remixicon/react"],
            charts: ["chart.js", "apexcharts"],
            utils: ["axios", "@reduxjs/toolkit"],
          },
        },
      },
      chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
    },
    optimizeDeps: {
      include: ["react", "react-dom", "bootstrap"],
    },
    define: {
      // Replace process.env in production builds
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});
