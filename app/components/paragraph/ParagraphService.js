const db = require("../../models");
const models = db.sequelize.models;
const Op = db.Sequelize.Op;

class ParagraphService {
  createParagraph = async (content) => {
    const newParagraph = await models.Paragraph.create({
      heading: content.heading,
      paragraph: content.paragraph,
    });

    return newParagraph;
  };
}

module.exports = new ParagraphService();
