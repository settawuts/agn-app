setInterval(() => {
  console.log(
    JSON.stringify({
      level: "info",
      message: "Updating timestamp...",
      time: new Date(),
    }),
  );
}, Number(process.env.HEARTBEAT_INTERVAL_MS) || 10000);