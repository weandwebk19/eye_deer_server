const db = require("../../models");
const models = db.sequelize.models;
const Op = db.Sequelize.Op;

class SlideService {
  createSlide = async (slide) => {
    const newSlide = await models.Slide.create({
      ...slide,
    });

    return newSlide;
  };
}

module.exports = new SlideService();
