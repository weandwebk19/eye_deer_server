const presentHandler = require("./presentHandler");

function onConnection(io, socket) {
  presentHandler(io, socket);
}

module.exports = onConnection;
