module.exports = (io, socket) => {
  const userJoinPresent = (data) => {
    console.log("data", data);
    socket.join(data.code);
    socket.emit("SERVER_SEND_JOIN_SUCCESS", data);
    const rooms = socket.adapter.rooms;
    rooms.forEach((room) => {
      console.log(room);
    });
  };

  const createRoom = (data) => {
    socket.join(data);
    socket.room = data;
    console.log(socket.adapter.rooms);
  };

  socket.on("CLIENT_SEND_JOIN_PRESENTATION", userJoinPresent);
  socket.on("CLIENT_SEND_CREATE_ROOM", createRoom);
};
