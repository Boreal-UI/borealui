import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
export default defineConfig({ plugins: [react(), {
  name: "notification-ssr-fixture",
  configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      if (!request.url?.startsWith("/__tests__/browser/notifications?")) return next();
      try {
        const variant = new URL(request.url, "http://localhost").searchParams.get("variant") ?? "core";
        const renderer = await server.ssrLoadModule("/__tests__/browser/notification.server.tsx");
        const html = renderer.render(variant);
        response.setHeader("Content-Type", "text/html");
        response.end(await server.transformIndexHtml(request.url, `<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Hydration fixture</title></head><body><div id="root">${html}</div><script type="module" src="/@vite/client"></script><script type="module" src="/__tests__/browser/notification.client.tsx"></script></body></html>`));
      } catch (error) { next(error); }
    });
  },
}], resolve: { alias: {
  "@": path.resolve("src"), "next/link": path.resolve("__tests__/browser/link.tsx"), "next/navigation": path.resolve("__tests__/browser/navigation.ts"),
} }, server: { host: "127.0.0.1", port: 4178, strictPort: true } });
