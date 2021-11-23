const { Socket } = require("socket.io");

/**
 * get list of connected sockets
 * @param {Socket} io socket io
 */
function getListOfSockets(io) {
  return [...io.sockets.sockets].map((s) => {
    return {
      id: s[0],
      name: s[1].name || undefined
    }
  });
}

module.exports = { getListOfSockets };
