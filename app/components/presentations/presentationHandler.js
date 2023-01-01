const rediscl = require("../../redis");
const presentationService = require("./presentationService");

module.exports = (io, socket) => {
  const userJoinPresent = async (data) => {
    socket.join(data.code);
    const currentPresentation = await rediscl.get(data.code);
    const presentation = presentationService.getPresentationById(
      currentPresentation.presentationId
    );

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
        host: socket.id,
      })
    );
    console.log("rediscl", await rediscl.get(code));
    // console.log(socket.adapter.rooms);
  };

  const endPresent = async (data) => {
    console.log("end present", data);
    rediscl.del(data);
    io.sockets.in(data).emit("PARTICIPANT_END_PRESENT");
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

  const increaseVote = async (data) => {
    console.log("increaseVote", data);
    const room = await rediscl.get(data.code);
    if (room) {
      const roomInfo = JSON.parse(room);
      console.log("roomInfo", roomInfo);
      const host = roomInfo.host;
      io.sockets.to(host).emit("SERVER_SEND_INCREASE_VOTE", data);
    }
  };

  socket.on("CLIENT_SEND_JOIN_PRESENTATION", userJoinPresent);
  socket.on("HOST_START_PRESENT", startPresent);
  socket.on("HOST_END_PRESENT", endPresent);
  socket.on("HOST_MOVE_TO_SLIDE", moveToSlide);
  socket.on("PARTICIPANT_SEND_INCREASE_VOTE", increaseVote);
};
