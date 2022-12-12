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
    console.log(data);
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
    // console.log("rediscl", await rediscl.get(data));
    // console.log(socket.adapter.rooms);
  };

  socket.on("CLIENT_SEND_JOIN_PRESENTATION", userJoinPresent);
  socket.on("HOST_START_PRESENT", startPresent);
  socket.on("HOST_END_PRESENT", endPresent);
};
