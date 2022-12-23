const db = require("../../models");
const models = db.sequelize.models;
const Op = db.Sequelize.Op;

class HeadingService {
  createHeading = async (content) => {
    const newHeading = await models.Heading.create({
      heading: content.heading,
      subHeading: content.subHeading,
    });

    return newHeading;
  };
}

module.exports = new HeadingService();
