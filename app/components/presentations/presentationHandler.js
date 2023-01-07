const rediscl = require("../../redis");
const groupService = require("../groups/groupService");
const userService = require("../users/userService");
const presentationService = require("./presentationService");

module.exports = (io, socket) => {
  const userJoinPresent = async (data) => {
    try {
      // console.log("data", data);
      const currentPresentationJson = await rediscl.get(data.code);
      const currentPresentation = JSON.parse(currentPresentationJson);
      // console.log("currentPresentation", currentPresentation);

      if (currentPresentation && data) {
        const presentation = await presentationService.getPresentationById(
          parseInt(currentPresentation.presentationId)
        );

        // console.log("presentation", presentation);
        if (presentation) {
          if (presentation.status === 0) {
            //status === 0 means that the presentation is private
            // console.log("currentPresentation", currentPresentation);
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

          //add user to list participants
          const listParticipantsJson = await rediscl.get(
            `presentation${currentPresentation.presentationId}_participants`
          );
          const listParticipants = JSON.parse(listParticipantsJson);
          if (listParticipants) {
            const existedUser = listParticipants.find(
              (participant) => participant.id === data.user.id
            );
            if (!existedUser) {
              const newListParticipants = listParticipants.concat({
                ...data.user,
              });
              rediscl.set(
                `presentation${currentPresentation.presentationId}_participants`,
                JSON.stringify(newListParticipants)
              );
              io.sockets
                .to(currentPresentation.host)
                .emit("SERVER_SEND_LIST_PARTICIPANTS", newListParticipants);
            }
          }
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
    const { code, presentationId, slideId, groupId, user } = data;
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
    rediscl.set(
      `presentation${presentationId}_participants`,
      JSON.stringify([
        {
          ...user,
        },
      ])
    );
    // console.log("rediscl", await rediscl.get(code));
    // console.log(socket.adapter.rooms);

    // notify to all members in group
    const members = await groupService.getListMembers(groupId);
    members.forEach(async (member) => {
      const socketId = await rediscl.get(`socketid_${member.id}`);
      io.sockets.to(socketId).emit("SERVER_SEND_HOST_START_PRESENT", data);
    });
  };

  const endPresent = async (data) => {
    console.log("end present", data);
    rediscl.del(data.code);
    rediscl.del(`presentation${data.presentationId}_participants`);
    rediscl.del(`presentation${data.presentationId}_chatMessages`);
    io.sockets.in(data.code).emit("PARTICIPANT_END_PRESENT");
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

  const handleCreateChatMessage = async (data) => {
    try {
      const { code, presentationId, ...chatInfo } = data;

      io.sockets.in(code).emit("SERVER_SEND_CHAT_MESSAGE", chatInfo);

      const chatMessagesJson = await rediscl.get(
        `presentation${presentationId}_chatMessages`
      );
      if (chatMessagesJson) {
        const chatMessages = JSON.parse(chatMessagesJson);
        const newChatMessages = chatMessages.concat(chatInfo);
        rediscl.set(
          `presentation${presentationId}_chatMessages`,
          JSON.stringify(newChatMessages)
        );
      } else {
        rediscl.set(
          `presentation${presentationId}_chatMessages`,
          JSON.stringify([chatInfo])
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleResponseChatMessage = async (data) => {
    const { code, presentationId } = data;
    const chatMessagesJson = await rediscl.get(
      `presentation${presentationId}_chatMessages`
    );
    if (chatMessagesJson) {
      const chatMessages = JSON.parse(chatMessagesJson);
      socket.emit("SERVER_SEND_LIST_MESSAGES", chatMessages);
    }
  };

  const handleResponseParticipantsList = async (data) => {
    const { code, presentationId } = data;
    const participantsJson = await rediscl.get(
      `presentation${presentationId}_participants`
    );
    if (participantsJson) {
      const participants = JSON.parse(participantsJson);
      socket.emit("SERVER_SEND_LIST_PARTICIPANTS", participants);
    }
  };

  const handleSetUserToRedis = async (user) => {
    if (user) {
      rediscl.set(`socketid_${user.id}`, socket.id);
    }
  };

  const handleRemoveUserFromRedis = async (user) => {
    if (user) {
      rediscl.del(`socketid_${user.id}`);
    }
  };

  socket.on("CLIENT_SEND_JOIN_PRESENTATION", userJoinPresent);
  socket.on("HOST_START_PRESENT", startPresent);
  socket.on("HOST_END_PRESENT", endPresent);
  socket.on("HOST_MOVE_TO_SLIDE", moveToSlide);
  socket.on("PARTICIPANT_SEND_INCREASE_VOTE", increaseVote);
  socket.on("PARTICIPANT_SEND_MESSAGE", handleCreateChatMessage);
  socket.on("CLIENT_GET_LIST_MESSAGES", handleResponseChatMessage);
  socket.on("CLIENT_GET_LIST_PARTICIPANTS", handleResponseParticipantsList);
  socket.on("CLIENT_CONECTED", handleSetUserToRedis);
  socket.on("CLIENT_DISCONECTED", handleRemoveUserFromRedis);
};
