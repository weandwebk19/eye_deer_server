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
}

module.exports = new SlideController();
