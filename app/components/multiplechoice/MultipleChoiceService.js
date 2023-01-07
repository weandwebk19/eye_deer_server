const db = require("../../models");
const models = db.sequelize.models;
const Op = db.Sequelize.Op;

class MultipleChoiceService {
  createMultipleChoice = async (content) => {
    const newMultipleChoice = await models.MultipleChoice.create({
      question: content.question,
    });

    return newMultipleChoice;
  };
}

module.exports = new MultipleChoiceService();
