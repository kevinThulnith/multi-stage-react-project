import compression from "compression";
import express from "express";
import sirv from "sirv";
import path from "path";
import fs from "fs";

// __dirname is natively available in CJS bundles produced by esbuild
const host = process.env.HOST ?? "0.0.0.0";
const port = parseInt(process.env.PORT ?? "5173");

async function createServer() {
  const app = express();
  app.use(compression());

  // Serve static files from the client build directory
  app.use(
    sirv("dist/client", {
      gzip: true,
      brotli: true,
    })
  );

  // Universal catch-all handler for SSR
  app.use("*", async (req, res, next) => {
    try {
      const template = fs.readFileSync(
        path.resolve(__dirname, "dist/client/index.html"),
        "utf-8"
      );

      const serverEntry = await import("./dist/server/entry-server.js");
      const render = serverEntry.render;
      const renderResult = render();
      const appHtml =
        typeof renderResult === "string" ? renderResult : renderResult.html;
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      console.error("SSR Error:", e);
      next(e);
    }
  });

  app.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`);
  });
}

createServer();
