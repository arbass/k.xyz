import * as esbuild from 'esbuild';
import express from 'express';
import { readdirSync, readFileSync } from 'fs';
import http from 'http';
import https from 'https';
import { join, sep } from 'path';

// Config output
const BUILD_DIRECTORY = 'dist';
const PRODUCTION = process.env.NODE_ENV === 'production';

// Config entrypoint files
const ENTRY_POINTS = ['src/index.ts'];

// Config dev serving
const LIVE_RELOAD = !PRODUCTION;
const SERVE_PORT = 3000;
const SERVE_ORIGIN = `https://localhost:${SERVE_PORT}`; // HTTPS для внешнего сервера

// HTTPS options
const HTTPS_OPTIONS = {
  key: readFileSync('localhost-key.pem'),
  cert: readFileSync('localhost.pem'),
  secureProtocol: 'TLSv1_2_method', // Используем TLS 1.2
};

// Create context
const context = await esbuild.context({
  bundle: true,
  entryPoints: ENTRY_POINTS,
  outdir: BUILD_DIRECTORY,
  minify: PRODUCTION,
  sourcemap: !PRODUCTION,
  target: PRODUCTION ? 'es2020' : 'esnext',
  inject: LIVE_RELOAD ? ['./bin/live-reload.js'] : undefined,
  define: {
    SERVE_ORIGIN: JSON.stringify(SERVE_ORIGIN),
  },
});

// Build files in prod
if (PRODUCTION) {
  await context.rebuild();
  context.dispose();
} else {
  await context.watch();

  // Start esbuild's internal server on HTTP
  const esbuildServer = await context.serve({
    servedir: BUILD_DIRECTORY,
    port: SERVE_PORT + 1, // Порт для esbuild-сервера
  });

  // Create an Express server to handle HTTPS requests
  const app = express();

  // Проксируем запросы к esbuild серверу через HTTP
  app.use((req, res) => {
    const options = {
      hostname: 'localhost',
      port: SERVE_PORT + 1,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    // Используем http для внутреннего подключения
    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      res.status(500).send('Internal Server Error');
    });

    req.pipe(proxyReq, { end: true });
  });

  // Создаем HTTPS-сервер на основе express
  https.createServer(HTTPS_OPTIONS, app).listen(SERVE_PORT, () => {
    console.log(`Serving on ${SERVE_ORIGIN}`);
  });

  logServedFiles();
}

/**
 * Logs information about the files that are being served during local development.
 */
function logServedFiles() {
  /**
   * Recursively gets all files in a directory.
   * @param {string} dirPath
   * @returns {string[]} An array of file paths.
   */
  const getFiles = (dirPath) => {
    const files = readdirSync(dirPath, { withFileTypes: true }).map((dirent) => {
      const path = join(dirPath, dirent.name);
      return dirent.isDirectory() ? getFiles(path) : path;
    });

    return files.flat();
  };

  const files = getFiles(BUILD_DIRECTORY);

  const filesInfo = files
    .map((file) => {
      if (file.endsWith('.map')) return;

      // Normalize path and create file location
      const paths = file.split(sep);
      paths[0] = SERVE_ORIGIN;

      const location = paths.join('/');

      // Create import suggestion
      const tag = location.endsWith('.css')
        ? `<link href="${location}" rel="stylesheet" type="text/css"/>`
        : `<script defer src="${location}"></script>`;

      return {
        'File Location': location,
        'Import Suggestion': tag,
      };
    })
    .filter(Boolean);

  // eslint-disable-next-line no-console
  console.table(filesInfo);
}
