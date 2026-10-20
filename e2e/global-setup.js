// Refuse to run while anything listens on port 5000. The app still calls
// http://localhost:5000 directly (ARCH-001); locally that port is the dev API,
// which is connected to the real Atlas database. Tests must never reach it.
const net = require("node:net");

function isListening(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: "127.0.0.1" });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });
}

module.exports = async () => {
  if (await isListening(5000)) {
    throw new Error(
      "Port 5000 is in use (probably the dev API connected to Atlas). Stop it before running E2E tests.",
    );
  }
};
