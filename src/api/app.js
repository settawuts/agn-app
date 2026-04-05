const express = require("express");
const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(
      JSON.stringify({
        level: "info",
        message: "API started",
        port,
      }),
    );
  });
}

module.exports = app;