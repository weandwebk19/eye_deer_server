const db = require("../../models");
const models = db.sequelize.models;
const Op = db.Sequelize.Op;

class SlideService {
  createSlide = async (slide) => {
    const newSlide = await models.slide.create({
      ...slide,
    });

    return newSlide;
  };

  updateSlide = async (slide) => {
    const newSlide = await models.slide.update(slide, {
      where: {
        id: slide.id,
      },
    });

    return newSlide;
  };

  getSlideContent = async (slide) => {
    let result;
    // const slide = await this.getSlideById(slideId);
    // const type = await this.getSlideTypeById(slide.typeId);

    if (slide.typeId === 1) {
      const content = await this.getMultipleChoiceById(slide.contentId);
      const options = await this.getOptionsByContentId(slide.contentId);
      result = {
        ...content,
        options: options,
      };
    } else if (slide.typeId === 2) {
      const content = await this.getHeadingById(slide.contentId);
      result = content;
    } else if (slide.typeId === 3) {
      const content = await slideService.getParagraphById(slide.contentId);
      result = content;
    }
    return result;
  };

  getListSlideByPresentationId = async (presentationId) => {
    const slides = await models.slide.findAll({
      raw: true,
      where: {
        presentationId,
      },
    });
    return slides;
  };

  getSlideTypeById = async (typeId) => {
    const type = await models.slidetype.findOne({
      raw: true,
      where: {
        id: typeId,
      },
    });
    return type;
  };

  getMultipleChoiceById = async (contentId) => {
    const type = await models.multiplechoice.findOne({
      raw: true,
      where: {
        id: contentId,
      },
    });
    return type;
  };

  getHeadingById = async (contentId) => {
    const type = await models.heading.findOne({
      raw: true,
      where: {
        id: contentId,
      },
    });
    return type;
  };

  getParagraphById = async (contentId) => {
    const type = await models.paragraph.findOne({
      raw: true,
      where: {
        id: contentId,
      },
    });
    return type;
  };

  getOptionsByContentId = async (contentId) => {
    const option = await models.option.findAll({
      raw: true,
      where: {
        contentId,
      },
    });
    return option;
  };

  getSlideById = async (slideId) => {
    const slide = await models.slide.findOne({
      raw: true,
      where: {
        id: slideId,
      },
    });
    return slide;
  };

  getSlideByIdAndPresentationId = async (slideId, presentationId) => {
    const slide = await models.slide.findOne({
      raw: true,
      where: {
        presentationId: presentationId,
        id: slideId,
      },
    });
    return slide;
  };

  getSlideByPresentationId = async (presentationId) => {
    const slide = await models.slide.findOne({
      raw: true,
      where: {
        presentationId: presentationId,
      },
    });
    return slide;
  };

  // getOptionBy = async (slideId, presentationId) => {
  //   const slide = await models.slide.findOne({
  //     raw: true,
  //     where: {
  //       presentationId: presentationId,
  //       id: slideId,
  //     },
  //   });
  //   return slide;
  // };

  increaseVote = async (contentId, optionId, newVote) => {
    const option = await models.option.update(
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

  createMultipleChoice = async (content) => {
    const newMultipleChoice = await models.multiplechoice.create(content, {
      raw: false,
    });

    return newMultipleChoice;
  };

  createHeading = async (content) => {
    const newHeading = await models.heading.create(content, {
      raw: false,
    });

    return newHeading;
  };

  createParagraph = async (content) => {
    const newParagraph = await models.paragraph.create(content, {
      raw: false,
    });

    return newParagraph;
  };

  updateMultipleChoice = async (content) => {
    const newContent = await models.multiplechoice.upsert(content, {
      where: {
        id: content.id,
        slideId: content.slideId,
      },
    });
    return newContent;
    // const rawContent = {
    //   // id: content.id,
    //   slideId: content.slideId,
    //   question: content.question,
    //   image: content.image,
    //   options: content.options,
    //   layoutId: content.layoutId,
    // };
    // const newContent = await this.upsert(models.multiplechoice, rawContent, {
    //   id: content.id,
    //   slideId: content.slideId,
    // });

    // return newContent;
  };

  updateHeading = async (content) => {
    const newContent = await models.heading.upsert(content, {
      where: {
        id: content.id,
        slideId: content.slideId,
      },
    });
    return newContent;

    // const rawContent = {
    //   // id: content.id,
    //   slideId: content.slideId,
    //   heading: content.heading ? content.heading : "",
    //   subHeading: content.subHeading ? content.subHeading : "",
    // };

    // const newContent = await this.upsert(models.heading, rawContent, {
    //   id: content.id,
    //   slideId: content.slideId,
    // });
    // return newContent;
  };

  updateParagraph = async (content) => {
    const newContent = await models.paragraph.upsert(content, {
      where: {
        id: content.id,
        slideId: content.slideId,
      },
    });
    return newContent;

    // const newContent = await this.upsert(models.paragraph, content, {
    //   id: content.id,
    //   slideId: content.slideId,
    // });
    // return newContent;
  };

  deleteMultipleChoice = async (content) => {
    const newContent = await models.multiplechoice.destroy({
      force: true,
      where: {
        id: content.id,
        slideId: content.slideId,
      },
    });

    return newContent;
  };

  deleteHeading = async (content) => {
    const newContent = await models.heading.destroy({
      force: true,
      where: {
        id: content.id,
        slideId: content.slideId,
      },
    });

    return newContent;
  };

  deleteParagraph = async (content) => {
    const newContent = await models.paragraph.destroy({
      force: true,
      where: {
        id: content.id,
        slideId: content.slideId,
      },
    });

    return newContent;
  };

  updateOption = async (option) => {
    const newOption = await models.option.update(option, {
      where: {
        id: option.id,
        contentId: option.contentId,
      },
    });
    return newOption;
  };

  createOption = async (option) => {
    const newOption = await models.option.create(option, { raw: false });

    return newOption;
  };

  deleteOption = async (option) => {
    let condition = {};
    if (option.id) {
      condition.id = option.id;
    }
    if (option.contentId) {
      condition.contentId = option.contentId;
    }
    const newContent = await models.option.destroy({
      force: true,
      where: condition,
    });

    return newContent;
  };

  deleteSlide = async (slideId) => {
    await models.slide.destroy({
      force: true,
      where: {
        id: slideId,
      },
    });
  };

  resetVote = async (contentId) => {
    const newOption = await models.option.update(
      { vote: 0 },
      {
        where: {
          contentId: contentId,
        },
      }
    );
    return newOption;
  };

  removeUserVoted = async (slideId) => {
    const newVoted = await models.uservoted.destroy({
      force: true,
      where: {
        slideId: slideId,
      },
    });
    return newVoted;
  };
}

module.exports = new SlideService();
