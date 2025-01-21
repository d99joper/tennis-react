const fs = require("fs");

const LOG_ID = Math.random().toString(36).substring(2, 8); // Unique log ID for each load

console.log(`CRACO is starting... (${LOG_ID}, PID: ${process.pid}) at ${new Date().toISOString()}`);
console.log("Running from:", process.cwd());

module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync("localhost-key.pem"),
      cert: fs.readFileSync("localhost.pem"),
    },
    setupMiddlewares: (middlewares, devServer) => {
      console.log("Setting up middlewares...");
      return middlewares;
    },
  },
};
console.log("HTTPS dev server settings applied.");