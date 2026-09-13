import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Works when bundled to CJS (esbuild shims import.meta.url) and when the
// serverless function runs as ESM (Vercel "type": "module").
const moduleDir = path.dirname(fileURLToPath(import.meta.url));

export function serveStatic(app: Express) {
  const candidates = [
    path.resolve(moduleDir, "public"),
    path.resolve(moduleDir, "dist/public"),
    path.resolve(moduleDir, "../dist/public"),
    path.resolve(process.cwd(), "dist/public"),
  ];
  const distPath = candidates.find((p) => fs.existsSync(p));
  if (!distPath) {
    throw new Error(
      `Could not find the build directory (tried: ${candidates.join(", ")}), make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}