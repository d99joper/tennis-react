const fs = require("fs");
const path = require('path');

const LOG_ID = Math.random().toString(36).substring(2, 8); // Unique log ID for each load

console.log(`CRACO is starting... (${LOG_ID}, PID: ${process.pid}) at ${new Date().toISOString()}`);
console.log("Running from:", process.cwd());


module.exports = {
  devServer: {
    port: 3000,
    server: {
      type: 'https',
      options: {
        key:  fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
        // optional, if mkcert gave you a rootCA.pem you want to trust explicitly:
        // ca: fs.readFileSync(path.resolve(__dirname, 'rootCA.pem')),
        // passphrase: '...' // only if your key is encrypted (mkcert keys are not)
      }
    }
  }
};
console.log("HTTPS dev server settings applied.");