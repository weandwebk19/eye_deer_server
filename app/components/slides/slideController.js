const slideService = require("./slideService");
const sildeService = require("./slideService");
class SlideController {
  // [POST] /slides/create
  createSlide = async function (req, res) {
    try {
      const slideName = req.body.slideName;
      const presentationId = req.body.presentationId;

      const newSlide = await sildeService.createSlide({
        name: slideName,
        presentationId: presentationId,
        typeId: 1, // TODO : create new type and assign id in here
        customizeId: 1, // TODO: create new customize and assign id in here
        note: "",
      });

      return res.status(201).json({
        success: true,
        message: "Create new slide successfully.",
        data: newSlide,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  // [PUT] /slides/:id/option/:optionId
  increaseVote = async function (req, res) {
    try {
      const { presentationId, slideId, optionId, newVote } = req.body;

      const slide = await sildeService.getSlideByIdAndPresentationId(
        slideId,
        presentationId
      );
      if (slide) {
        if (slide.typeId !== 1) {
          return res.status(406).json({
            success: false,
            message: "This slide type is not supported.",
          });
        }

        const option = await slideService.increaseVote(
          slide.contentId,
          optionId,
          newVote
        );

        return res.status(200).json({
          success: true,
          message: "Update vote successfully.",
          data: option,
        });
      }

      return res.status(404).json({
        success: false,
        message: "Slide  is not found.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  // [GET] /slides/:id/option/:optionId
  getOption = async function (req, res) {
    try {
      const { id, optionId } = req.params;

      const slide = await sildeService.getSlideByIdAndPresentationId(
        slideId,
        presentationId
      );
      if (slide) {
        if (slide.typeId !== 1) {
          return res.status(406).json({
            success: false,
            message: "This slide type is not supported.",
          });
        }

        const option = await slideService.increaseVote(
          slide.contentId,
          optionId,
          newVote
        );

        return res.status(200).json({
          success: true,
          message: "Update vote successfully.",
          data: option,
        });
      }

      return res.status(404).json({
        success: false,
        message: "Slide  is not found.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
}

module.exports = new SlideController();
