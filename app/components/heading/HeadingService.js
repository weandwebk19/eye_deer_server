const db = require("../../models");
const models = db.sequelize.models;
const Op = db.Sequelize.Op;

class HeadingService {
  createHeading = async (content) => {
    const newHeading = await models.heading.create({
      heading: content.heading,
      subHeading: content.subHeading,
    });

    return newHeading;
  };
}

module.exports = new HeadingService();
