const db = require("../../models");
const models = db.sequelize.models;
const Op = db.Sequelize.Op;
const generatePresentationCode = require("../../utils/generatePresentationCode");

class PresentationService {
  generateCode = async () => {
    let newCode = generatePresentationCode();
    const count = await models.Presentation.count({
      // distinct: true,
      where: { code: newCode },
    });

    if (count > 0) {
      return await this.generateCode();
    } else {
      return newCode;
    }
  };

  creategroupPresentation = async (groupPresenataion) => {
    const newResource = await models.Group_Presentation.create({
      ...groupPresenataion,
    });

    return newResource;
  };

  createPresentation = async (presentation) => {
    const newCode = await this.generateCode();
    const newPresentation = await models.Presentation.create({
      ...presentation,
      code: newCode,
    });

    return newPresentation;
  };

  getPresentationById = async (presentationId) => {
    const presentation = await models.Presentation.findOne({
      where: { id: presentationId },
      raw: true,
    });

    return presentation;
  };

  removePresentation = async (presentationId) => {
    // soft delete all slide of this presentation. Currently, This does not exist slides, handle later

    // soft delte presentation
    await models.Presentation.destroy({
      where: {
        id: presentationId,
      }
    });
  }
}

module.exports = new PresentationService();
