import { createServer as createViteServer, ViteDevServer } from "vite";
import compression from "compression";
import { fileURLToPath } from "url";
import express from "express";
import sirv from "sirv";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";
const host = process.env.HOST ?? "0.0.0.0";
const port = parseInt(process.env.PORT ?? "5173");

async function createServer() {
  const app = express();
  app.use(compression());

  let vite: ViteDevServer | undefined;
  if (!isProd) {
    // Development: Use Vite's dev server middleware
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve static files from the client build directory
    // sirv is a high-performance static file server
    app.use(
      sirv("dist/client", {
        gzip: true,
        brotli: true,
      })
    );
  }

  // Universal catch-all handler
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template, render;

      if (!isProd) {
        // Dev: Load files through Vite
        template = fs.readFileSync(
          path.resolve(__dirname, "index.html"),
          "utf-8"
        );
        if (vite) {
          template = await vite.transformIndexHtml(url, template);
          const serverEntry = await vite.ssrLoadModule("/src/entry-server.tsx");
          render = serverEntry.render;
        }
      } else {
        // Prod: Load pre-built files
        template = fs.readFileSync(
          path.resolve(__dirname, "dist/client/index.html"),
          "utf-8"
        );
        const serverEntry = await import("./dist/server/entry-server.js");
        render = serverEntry.render;
      }

      const renderResult = render();
      const appHtml =
        typeof renderResult === "string" ? renderResult : renderResult.html;
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      console.error("SSR Error:", e);
      if (vite) vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  app.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`);
  });
}

createServer();
