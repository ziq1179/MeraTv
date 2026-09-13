import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, mkdir, cp, writeFile, readdir, copyFile } from "fs/promises";
import path from "path";

const OUT = ".vercel/output";

async function copyDir(src: string, dest: string) {
  await mkdir(dest, { recursive: true });
  for (const entry of await readdir(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(from, to);
    } else {
      await copyFile(from, to);
    }
  }
}

async function buildVercelOutput() {
  await rm(OUT, { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("assembling vercel output...");
  const funcDir = path.join(OUT, "functions", "api.func");
  await mkdir(funcDir, { recursive: true });

  await esbuild({
    entryPoints: ["server/vercel-handler.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: path.join(funcDir, "index.js"),
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    footer: {
      js: "module.exports = module.exports.default || module.exports;",
    },
    logLevel: "info",
  });

  // Self-contained CJS bundle: no dependencies to ship.
  await writeFile(
    path.join(funcDir, "package.json"),
    JSON.stringify({ type: "commonjs" }, null, 2),
  );

  await writeFile(
    path.join(funcDir, ".vc-config.json"),
    JSON.stringify(
      {
        handler: "index.js",
        runtime: "nodejs22.x",
        launcherType: "Nodejs",
      },
      null,
      2,
    ),
  );

  // Static files are served by Vercel's CDN/filesystem, not the function.
  await copyDir("dist/public", path.join(OUT, "static"));

  await writeFile(
    path.join(OUT, "config.json"),
    JSON.stringify(
      {
        version: 3,
        routes: [
          { src: "^/api(/.*)?$", dest: "/api" },
          { src: "^/favicon\\.ico$", dest: "/favicon.png" },
          { handle: "filesystem" },
          { src: "/(.*)", dest: "/index.html" },
        ],
      },
      null,
      2,
    ),
  );

  console.log("vercel output ready at", OUT);
}

buildVercelOutput().catch((err) => {
  console.error(err);
  process.exit(1);
});