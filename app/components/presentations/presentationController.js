const groupService = require("../groups/groupService");
const slideService = require("../slides/slideService");
const presentationService = require("./presentationService");
class PresentationController {
  // [POST] /presenataions/create
  createPresentation = async function (req, res) {
    try {
      const presentationName = req.body.presentationName;
      const userId = req.user.id;

      const newPresentation = await presentationService.createPresentation({
        name: presentationName,
        userCreated: userId,
      });

      // add presentation to group if exist groupId
      const groupId = req.body.groupId;
      if(groupId){
        groupService.addPresentationToGroup(groupId, newPresentation.id);
      }

      return res.status(201).json({
        success: true,
        message: "Create new presentation successfully.",
        data: newPresentation,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  // [GET] /presenataions/:id/code
  getCodePresentation = async function (req, res) {
    try {
      const presentationId = req.params.id;

      const presentation = await presentationService.getPresentationById(
        presentationId
      );

      if (presentation) {
        return res.status(200).json({
          success: true,
          message: "Get code of presentation successfully.",
          data: presentation.code,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "presentation not found.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  // [GET] /presenataions/:id/slides
  getSlidesPresentation = async function (req, res) {
    try {
      const presentationId = req.params.id;
      let slidesRes = [];
      const slides = await slideService.getListSlideByPresentationId(
        presentationId
      );

      if (slides) {
        slidesRes = await Promise.all(
          slides.map(async (slide) => {
            let result;
            const type = await slideService.getSlideTypeById(slide.typeId);

            if (slide.typeId === 1) {
              const content = await slideService.getMultipleChoiceById(
                slide.contentId
              );
              const options = await slideService.getOptionsByContentId(
                slide.contentId
              );
              result = {
                ...slide,
                type: type.name,
                content: {
                  ...content,
                  options: options,
                },
              };
            } else if (slide.typeId === 2) {
              const content = await slideService.getHeadingById(
                slide.contentId
              );
              result = {
                ...slide,
                type: type.name,
                content,
              };
            } else if (slide.typeId === 3) {
              const content = await slideService.getParagraphById(
                slide.contentId
              );
              result = {
                ...slide,
                type: type.name,
                content,
              };
            }
            return result;
          })
        );

        return res.status(200).json({
          success: true,
          message: "Get list slides of presentation successfully.",
          data: slidesRes,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "presentation not found.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  removePresentationInGroup = async (req, res) => {
    try {
      const {groupId, presentationId} = req.body;

      await presentationService.removePresentationInGroup(groupId, presentationId);

      return res.status(200).json({
        success: true,
        message: "Presentation was deleted!",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  // [GET] /presenataions/:id/slides/:slideId/users/:userId
  getUserVoted = async function (req, res) {
    try {
      const presentationId = req.params.id;
      const slideId = req.params.slideId;
      const userId = req.params.userId;

      const userVoted = await presentationService.countUserVoted({
        presentationId,
        slideId,
        userId,
      });
      console.log("userVoted", userVoted);
      if (userVoted > 0) {
        return res.status(200).json({
          success: true,
          message: "Get is user voted successfully.",
          data: true,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Get is user voted successfully.",
          data: false,
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
  removePresentation = async (req, res) => {
    try {
      const {presentationId} = req.body;
      const userId = req.user.id;

      await presentationService.removePresentation(presentationId, userId);

      return res.status(200).json({
        success: true,
        message: "Presentation was deleted!",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getMyPresentations = async (req, res) => {
    try{
      const userId = req.user.id;

      const presentations = await presentationService.getPresentationsOfUser(userId);
      
      res.status(200).json({
        success: true,
        message: "Get successfully",
        data: {presentations}
      })
    }
    catch(error){
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }

  getMyCoPresentations = async (req, res) => {
    try{
      const userId = req.user.id;

      const coPresentations = await presentationService.getCoPresentationsOfUser(userId);
      
      res.status(200).json({
        success: true,
        message: "Get successfully",
        data: {coPresentations}
      })
    }
    catch(error){
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }

  findPresentationsByName = async (req, res) => {
    try{
      const userId = req.user.id;
      const namePresentation = req.body.namePresentation;

      const presentations = await presentationService.findPresentationsByName(userId, namePresentation);
      
      res.status(200).json({
        success: true,
        message: "Get successfully",
        data: {presentations}
      })
    }
    catch(error){
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }
}

module.exports = new PresentationController();
