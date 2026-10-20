const http = require('http');
const os = require('os');

const PORT = process.env.PORT || 3000;
const ENV_NAME = 'SIT';

const server = http.createServer((req, res) => {
  const acceptHeader = req.headers['accept'] || '';
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const data = {
    status: 'success',
    environment: ENV_NAME,
    message: `Hello from ${ENV_NAME} environment!`,
    port: PORT,
    containerHost: os.hostname(),
    url: req.url,
    clientIp: clientIp,
    timestamp: new Date().toISOString()
  };

  if (acceptHeader.includes('text/html')) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Environment: ${ENV_NAME}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
          }
          .card {
            background: #1e293b;
            border-radius: 12px;
            padding: 32px 40px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
            border-top: 6px solid #10b981;
            max-width: 480px;
            width: 100%;
          }
          h1 { margin: 0 0 12px 0; color: #10b981; font-size: 28px; }
          .badge {
            display: inline-block;
            background: #059669;
            color: #fff;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 20px;
          }
          .info { background: #0f172a; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 14px; line-height: 1.6; }
          .label { color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">ENV: ${ENV_NAME}</span>
          <h1>${data.message}</h1>
          <div class="info">
            <div><span class="label">Container Port:</span> ${data.port}</div>
            <div><span class="label">Hostname:</span> ${data.containerHost}</div>
            <div><span class="label">Requested Path:</span> ${data.url}</div>
            <div><span class="label">Timestamp:</span> ${data.timestamp}</div>
          </div>
        </div>
      </body>
      </html>
    `);
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[${ENV_NAME}] Server running on port ${PORT}`);
});
