const presentationService = require("./presentationService");
class PresentationController {
  // [POST] /presenataions/create
  createPresentation = async function (req, res) {
    try {
      const presentationName = req.body.presentationName;
      const groupId = req.body.groupId;
      const userId = req.user.id;

      const newPresentation = await presentationService.createPresentation({
        name: presentationName,
        userCreated: userId,
      });

      await presentationService.creategroupPresentation({
        groupId: groupId,
        presentationId: newPresentation.id,
      });

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
}

module.exports = new PresentationController();
