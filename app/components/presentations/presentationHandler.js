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

  const handleCreateChatQuestion = async (data) => {
    try {
      const { code, presentationId, ...questionInfo } = data;
      // const newChatQuestion = await presentationService.createChatQuestion(
      //   chatQuestion
      // );

      io.sockets.in(code).emit("SERVER_SEND_CHAT_QUESTION", data);

      const chatQuestionsJson = await rediscl.get(
        `presentation${presentationId}_chatQuestions`
      );
      if (chatQuestionsJson) {
        const chatQuestions = JSON.parse(chatQuestionsJson);
        const newChatQuestions = chatQuestions.concat(data);
        rediscl.set(
          `presentation${presentationId}_chatQuestions`,
          JSON.stringify(newChatQuestions)
        );
        console.log(newChatQuestions);
      } else {
        rediscl.set(
          `presentation${presentationId}_chatQuestions`,
          JSON.stringify([data])
        );
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleResponseChatQuestion = async (data) => {
    const { code, presentationId } = data;
    const chatQuestionsJson = await rediscl.get(
      `presentation${presentationId}_chatQuestions`
    );
    if (chatQuestionsJson) {
      const chatQuestions = JSON.parse(chatQuestionsJson);
      socket.emit("SERVER_SEND_LIST_QUESTIONS", chatQuestions);
    }
  };

  const markAsAnsweredQuestion = async (data) => {
    // await presentationService.updateMarkAsAnswered(data.questionId);
    // io.sockets.emit("PARTICIPANT_QUESTION_ANSWERED", data);

    const chatQuestionsJson = await rediscl.get(
      `presentation${data.presentationId}_chatQuestions`
    );
    if (chatQuestionsJson) {
      const chatQuestions = JSON.parse(chatQuestionsJson);
      chatQuestions.find(
        (question) => question.id === data.questionId
      ).isAnswered = true;
      rediscl.set(
        `presentation${data.presentationId}_chatQuestions`,
        JSON.stringify(chatQuestions)
      );
      socket.emit("SERVER_SEND_LIST_QUESTIONS", chatQuestions);
      socket.in(data.code).emit("PARTICIPANT_QUESTION_ANSWERED", chatQuestions);
    }
  };

  const restoreQuestion = async (data) => {
    // await presentationService.updateRestoreQuestion(data.questionId);
    // io.sockets.emit("PARTICIPANT_QUESTION_RESTORED", data);

    const chatQuestionsJson = await rediscl.get(
      `presentation${data.presentationId}_chatQuestions`
    );
    if (chatQuestionsJson) {
      const chatQuestions = JSON.parse(chatQuestionsJson);
      chatQuestions.find(
        (question) => question.id === data.questionId
      ).isAnswered = false;
      rediscl.set(
        `presentation${data.presentationId}_chatQuestions`,
        JSON.stringify(chatQuestions)
      );
      socket.emit("SERVER_SEND_LIST_QUESTIONS", chatQuestions);
      socket.in(data.code).emit("PARTICIPANT_QUESTION_RESTORED", chatQuestions);
    }
  };

  const handleResponseQuestionUpvote = async (data) => {
    const { questionId, presentationId } = data;
    const chatQuestionsJson = await rediscl.get(
      `presentation${presentationId}_chatQuestions`
    );
    if (chatQuestionsJson) {
      const chatQuestions = JSON.parse(chatQuestionsJson);
      const questionUpvotes = await chatQuestions.find(
        (question) => question.id === questionId
      );
      socket.emit("SERVER_SEND_LIST_UPVOTES", questionUpvotes);
    }
  };

  const upvoteQuestion = async (data) => {
    try {
      const chatQuestionsJson = await rediscl.get(
        `presentation${data.presentationId}_chatQuestions`
      );
      if (chatQuestionsJson) {
        const chatQuestions = JSON.parse(chatQuestionsJson);
        chatQuestions
          .find((question) => question.id === data.questionId)
          .upvote.push(data.userId);
        rediscl.set(
          `presentation${data.presentationId}_chatQuestions`,
          JSON.stringify(chatQuestions)
        );
        socket.emit("SERVER_SEND_LIST_QUESTIONS", chatQuestions);
        socket.in(data.code).emit("SERVER_SEND_UPVOTE_QUESTION", chatQuestions);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const unupvoteQuestion = async (data) => {
    try {
      const chatQuestionsJson = await rediscl.get(
        `presentation${data.presentationId}_chatQuestions`
      );
      if (chatQuestionsJson) {
        const chatQuestions = JSON.parse(chatQuestionsJson);
        const userUnupvote = chatQuestions.indexOf(data.userId);
        chatQuestions
          .find((question) => question.id === data.questionId)
          .upvote.splice(userUnupvote, 1);
        rediscl.set(
          `presentation${data.presentationId}_chatQuestions`,
          JSON.stringify(chatQuestions)
        );
        socket.emit("SERVER_SEND_LIST_QUESTIONS", chatQuestions);
        socket.in(data.code).emit("SERVER_SEND_UPVOTE_QUESTION", chatQuestions);
      }
    } catch (err) {
      console.log(err);
    }
  };

  socket.on("CLIENT_SEND_JOIN_PRESENTATION", userJoinPresent);
  socket.on("HOST_START_PRESENT", startPresent);
  socket.on("HOST_END_PRESENT", endPresent);
  socket.on("HOST_MOVE_TO_SLIDE", moveToSlide);
  socket.on("PARTICIPANT_SEND_INCREASE_VOTE", increaseVote);
  socket.on("PARTICIPANT_SEND_QUESTION", handleCreateChatQuestion);
  socket.on("HOST_MARK_AS_ANSWERED", markAsAnsweredQuestion);
  socket.on("HOST_RESTORE_QUESTION", restoreQuestion);
  socket.on("CLIENT_GET_LIST_QUESTIONS", handleResponseChatQuestion);
  socket.on("CLIENT_GET_LIST_UPVOTE", handleResponseQuestionUpvote);
  socket.on("PARTICIPANT_SEND_UPVOTE", upvoteQuestion);
  socket.on("PARTICIPANT_SEND_UNUPVOTE", unupvoteQuestion);
};
