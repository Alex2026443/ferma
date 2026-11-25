import devServer from "@hono/vite-dev-server"
import path from "path"
const __dirname = import.meta.dirname
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "kimi-preview-host",
      config(config) {
        const hosts = config.server?.allowedHosts;
        if (hosts === true || hosts?.includes("3000.proxy.internal")) return;
        return { server: { allowedHosts: ["3000.proxy.internal"] } };
      },
    },
    devServer({ entry: "api/boot.ts", exclude: [/^\/(?!api\/).*$/] }),
    inspectAttr(), react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.png', 'apple-touch-icon.png'],
    manifest: {
      name: 'Море как актив — Малый Утриш',
      short_name: 'Море как актив',
      description: 'Инвестиционная презентация и data room мидийно-устричной фермы.',
      theme_color: '#020813',
      background_color: '#020813',
      display: 'standalone',
      start_url: './',
      scope: './',
      icons: [
        { src: './pwa-192.png', sizes: '192x192', type: 'image/png' },
        { src: './pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
    workbox: {
      navigateFallback: null,
      globPatterns: ['**/*.{js,css,png,svg,woff2}'],
      runtimeCaching: [{ urlPattern: ({ request }) => request.mode === 'navigate', handler: 'NetworkOnly' }],
    },
  })],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contracts": path.resolve(__dirname, "./contracts"),
      "@db": path.resolve(__dirname, "./db"),
      "db": path.resolve(__dirname, "./db"),
    },
  },
  envDir: path.resolve(__dirname),
  // Keep Vite's public directory in development, but copy production assets
  // explicitly after bundling to avoid intermittent omissions on the preview FS.
  publicDir: process.env.NODE_ENV === "production" ? false : "public",
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
