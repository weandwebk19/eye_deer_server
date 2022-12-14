const rediscl = require("../redis");

module.exports = (io, socket) => {
  const userJoinPresent = async (data) => {
    console.log("data", data);
    socket.join(data.code);
    const currentPresentation = await rediscl.get(data.code);
    if (currentPresentation && data) {
      socket.emit("SERVER_SEND_JOIN_SUCCESS", data, currentPresentation);
    } else {
      socket.emit("SERVER_SEND_JOIN_FAIL");
    }
    // const rooms = socket.adapter.rooms;
    // rooms.forEach((room) => {
    //   console.log(room);
    // });
  };

  const startPresent = async (data) => {
    const { code, presentationId, slideId } = data;
    socket.join(code);
    socket.room = code;
    console.log("start", data);
    rediscl.set(
      code,
      JSON.stringify({
        presentationId,
        slideId,
      })
    );
    console.log("rediscl", await rediscl.get(code));
    // console.log(socket.adapter.rooms);
  };

  const endPresent = async (data) => {
    console.log("end present", data);
    rediscl.del(data);
    io.sockets.in(data).emit("PARTICIPANT_END_PRESENT", slideId);
    // console.log("rediscl", await rediscl.get(data));
    // console.log(socket.adapter.rooms);
  };

  const moveToSlide = (data) => {
    const { code, presentationId, slideId } = data;
    console.log("move to sldie", data);
    rediscl.set(
      code,
      JSON.stringify({
        presentationId,
        slideId,
      })
    );
    io.sockets.in(code).emit("PARTICIPANT_MOVE_TO_SLIDE", slideId);
  };

  socket.on("CLIENT_SEND_JOIN_PRESENTATION", userJoinPresent);
  socket.on("HOST_START_PRESENT", startPresent);
  socket.on("HOST_END_PRESENT", endPresent);
  socket.on("HOST_MOVE_TO_SLIDE", moveToSlide);
};
