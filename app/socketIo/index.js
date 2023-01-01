const presentHandler = require("../components/presentations/presentationHandler");

function onConnection(io, socket) {
  presentHandler(io, socket);
}

module.exports = onConnection;
