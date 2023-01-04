const rediscl = require("../../redis");
const groupService = require("../groups/groupService");
const presentationService = require("./presentationService");

module.exports = (io, socket) => {
  const userJoinPresent = async (data) => {
    try {
      console.log("data", data);
      const currentPresentationJson = await rediscl.get(data.code);
      const currentPresentation = JSON.parse(currentPresentationJson);
      console.log("currentPresentation", currentPresentation);

      if (currentPresentation && data) {
        const presentation = await presentationService.getPresentationById(
          parseInt(currentPresentation.presentationId)
        );

        // console.log("presentation", presentation);
        if (presentation) {
          if (presentation.status === 0) {
            //status === 0 means that the presentation is private
            console.log("currentPresentation", currentPresentation);
            if (data.user.id && currentPresentation.groupId) {
              const isJoinedGroup = await groupService.isJoinedGroup(
                parseInt(currentPresentation.groupId),
                data.user.id
              );
              // console.log("isJoinedGroup", isJoinedGroup);

              if (!isJoinedGroup) {
                return socket.emit("SERVER_SEND_JOIN_FAIL");
              }
            } else {
              return socket.emit("SERVER_SEND_JOIN_FAIL");
            }
          }
          // console.log("SERVER_SEND_JOIN_SUCCESS");
          socket.join(data.code);
          socket.emit("SERVER_SEND_JOIN_SUCCESS", data, currentPresentation);
        }
      } else {
        socket.emit("SERVER_SEND_JOIN_FAIL");
      }
      // const rooms = socket.adapter.rooms;
      // rooms.forEach((room) => {
      //   console.log(room);
      // });
    } catch (error) {
      console.log(error);
    }
  };

  const startPresent = async (data) => {
    const { code, presentationId, slideId, groupId } = data;
    socket.join(code);
    socket.room = code;
    console.log("start", data);
    rediscl.set(
      code,
      JSON.stringify({
        presentationId,
        slideId,
        groupId,
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

  const moveToSlide = async (data) => {
    const { code, presentationId, slideId } = data;
    console.log("move to sldie", data);
    const currentPresentationJson = await rediscl.get(data.code);
    const currentPresentation = JSON.parse(currentPresentationJson);

    rediscl.set(
      code,
      JSON.stringify({
        ...currentPresentation,
        presentationId,
        slideId,
      })
    );
    io.sockets.in(code).emit("PARTICIPANT_MOVE_TO_SLIDE", slideId);
  };

  const increaseVote = async (data) => {
    console.log("increaseVote", data);
    const currentPresentationJson = await rediscl.get(data.code);
    const currentPresentation = JSON.parse(currentPresentationJson);

    if (currentPresentation) {
      // console.log("currentPresentation", currentPresentation);
      const host = currentPresentation.host;
      io.sockets.to(host).emit("SERVER_SEND_INCREASE_VOTE", data);

      const { presentationId, slideId, userId } = data;
      const userVoted = await presentationService.createUserVoted({
        presentationId,
        slideId,
        userId,
      });
    }
  };

  socket.on("CLIENT_SEND_JOIN_PRESENTATION", userJoinPresent);
  socket.on("HOST_START_PRESENT", startPresent);
  socket.on("HOST_END_PRESENT", endPresent);
  socket.on("HOST_MOVE_TO_SLIDE", moveToSlide);
  socket.on("PARTICIPANT_SEND_INCREASE_VOTE", increaseVote);
};
