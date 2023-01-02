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

  removePresentationInGroup = async (groupId, presentationId) => {
    //remove reference to group of presentation in group_presentations table
    await models.Group_Presentation.destroy({
      where: {
        groupId,
        presentationId,
      },
    });
  };
}

module.exports = new PresentationService();
