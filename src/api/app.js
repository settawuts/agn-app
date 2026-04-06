const express = require("express");
const client = require("prom-client");
const app = express();

client.collectDefaultMetrics();

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Request latency in ms",
  labelNames: ["method", "path", "status"],
  buckets: [10, 50, 100, 200, 500, 1000],
});

const httpErrorTotal = new client.Counter({
  name: "http_error_total",
  help: "Total HTTP errors",
  labelNames: ["method", "path", "status"],
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;

    httpRequestDuration.labels(req.method, req.path, res.statusCode).observe(duration);

    if (res.statusCode >= 400) {
      httpErrorTotal.labels(req.method, req.path, res.statusCode).inc();
    }

    console.log(JSON.stringify({
      level: res.statusCode >= 500 ? "error" : "info",
      message: "request",
      method: req.method,
      path: req.path,
      status: res.statusCode,
      latency_ms: duration,
      timestamp: new Date().toISOString(),
    }));
  });
  next();
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.send(await client.register.metrics());
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(JSON.stringify({ level: "info", message: "API started", port }));
  });
}

module.exports = app;