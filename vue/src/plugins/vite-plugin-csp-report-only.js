// CSP Report-Only: violations are logged but not blocked. Check browser console for reports.
const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' ws: wss:",
  "frame-ancestors 'self'",
].join('; ');

export const cspReportOnlyPlugin = () => ({
  name: 'csp-report-only',
  configureServer(server) {
    server.middlewares.use((_req, res, next) => {
      res.setHeader('Content-Security-Policy-Report-Only', cspReportOnly);
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((_req, res, next) => {
      res.setHeader('Content-Security-Policy-Report-Only', cspReportOnly);
      next();
    });
  },
});
