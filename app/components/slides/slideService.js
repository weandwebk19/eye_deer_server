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

  getListSlideByPresentationId = async (presentationId) => {
    const slides = await models.Slide.findAll({
      raw: true,
      where: {
        presentationId,
      },
    });
    return slides;
  };

  getSlideTypeById = async (typeId) => {
    const type = await models.SlideType.findOne({
      raw: true,
      where: {
        id: typeId,
      },
    });
    return type;
  };

  getMultipleChoiceById = async (contentId) => {
    const type = await models.MultipleChoice.findOne({
      raw: true,
      where: {
        id: contentId,
      },
    });
    return type;
  };

  getHeadingById = async (contentId) => {
    const type = await models.Heading.findOne({
      raw: true,
      where: {
        id: contentId,
      },
    });
    return type;
  };

  getParagraphById = async (contentId) => {
    const type = await models.Paragraph.findOne({
      raw: true,
      where: {
        id: contentId,
      },
    });
    return type;
  };

  getOptionsByContentId = async (contentId) => {
    const option = await models.Option.findAll({
      raw: true,
      where: {
        contentId,
      },
    });
    return option;
  };

  getSlideByIdAndPresentationId = async (slideId, presentationId) => {
    const slide = await models.Slide.findOne({
      raw: true,
      where: {
        presentationId: presentationId,
        id: slideId,
      },
    });
    return slide;
  };

  // getOptionBy = async (slideId, presentationId) => {
  //   const slide = await models.Slide.findOne({
  //     raw: true,
  //     where: {
  //       presentationId: presentationId,
  //       id: slideId,
  //     },
  //   });
  //   return slide;
  // };

  increaseVote = async (contentId, optionId, newVote) => {
    const option = await models.Option.update(
      { vote: newVote },
      {
        where: {
          id: optionId,
          contentId,
        },
      }
    );
    return option;
  };
}

module.exports = new SlideService();
