const HeadingService = require("../heading/HeadingService");
const MultipleChoiceService = require("../multiplechoice/MultipleChoiceService");
const ParagraphService = require("../paragraph/ParagraphService");
const slideService = require("./slideService");
class SlideController {
  // [POST] /slides/create
  createSlide = async function (req, res) {
    try {
      const slideName = req.body.slideName;
      const presentationId = req.body.presentationId;
      const index = req.body.index;
      const typeId = req.body.typeId;
      const content = req.body.content;
      let newContent;

      switch (typeId) {
        case 1:
          newContent = await MultipleChoiceService.createMultipleChoice(
            content
          );

          break;
        case 2:
          newContent = await HeadingService.createHeading(content);
          break;
        case 3:
          newContent = await ParagraphService.createParagraph(content);
          break;
        default:
          break;
      }

      const newSlide = await slideService.createSlide({
        name: slideName,
        index: index,
        presentationId: presentationId,
        typeId: typeId, // TODO : create new type and assign id in here
        customizeId: 1, // TODO: create new customize and assign id in here
        note: "",
        contentId: newContent.id,
      });

      return res.status(201).json({
        success: true,
        message: "Create new slide successfully.",
        data: newSlide,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  // [PUT] /slides/:id/option/:optionId
  increaseVote = async function (req, res) {
    try {
      const { presentationId, slideId, optionId, newVote } = req.body;

      const slide = await slideService.getSlideByIdAndPresentationId(
        slideId,
        presentationId
      );
      console.log(slide);
      if (slide) {
        if (slide.typeId !== 1) {
          return res.status(406).json({
            success: false,
            message: "This slide type is not supported.",
          });
        }

        const option = await slideService.updateOption({
          id: optionId,
          contentId: slide.contentId,
          vote: newVote,
        });

        return res.status(200).json({
          success: true,
          message: "Update vote successfully.",
          data: option,
        });
      }

      return res.status(404).json({
        success: false,
        message: "Slide  is not found.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  // [GET] /slides/:id/option/:optionId
  getOption = async function (req, res) {
    try {
      const { id, optionId } = req.params;

      const slide = await sildeService.getSlideByIdAndPresentationId(
        slideId,
        presentationId
      );
      if (slide) {
        if (slide.typeId !== 1) {
          return res.status(406).json({
            success: false,
            message: "This slide type is not supported.",
          });
        }

        const option = await slideService.increaseVote(
          slide.contentId,
          optionId,
          newVote
        );

        return res.status(200).json({
          success: true,
          message: "Update vote successfully.",
          data: option,
        });
      }

      return res.status(404).json({
        success: false,
        message: "Slide  is not found.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  // [PUT] /slides/:id/update
  updateCurrentSlide = async function (req, res) {
    try {
      const slide = req.body.slide;
      // console.log(slide);
      if (slide) {
        const { content, type, createdAt, updatedAt, ...rawSlide } = slide;
        let newSlide = await slideService.updateSlide(rawSlide);
        // let slideRes = { ...slide };
        // console.log("newSlide", slideRes);

        if (slide.typeId === 1) {
          const { options, contentId, createdAt, updatedAt, ...rawContent } =
            content;
          // console.log(rawContent);
          const newContent = await slideService.updateMultipleChoice(
            rawContent
          );
          options.forEach((option) => {
            const newOption = slideService.updateOption(option);
          });
        } else if (slide.typeId === 2) {
          const { contentId, createdAt, updatedAt, ...rawContent } = content;
          const newContent = await slideService.updateHeading(rawContent);
        } else {
          const { contentId, createdAt, updatedAt, ...rawContent } = content;
          const newContent = await slideService.updateParagraph(rawContent);
        }

        return res.status(200).json({
          success: true,
          message: "Update current slide successfully.",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Slide not found.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  // [POST] /slides/:id/option/create
  createOption = async function (req, res) {
    try {
      const optionContent = req.body.option;
      console.log(optionContent);

      const newOption = await slideService.createOption(optionContent);
      // console.log("option", newOption);

      return res.status(201).json({
        success: true,
        message: "Create new option successfully.",
        data: newOption,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  // [PUT] /slides/:id/content/:contentId/type/:typeId/update
  changeSlideTypeContent = async function (req, res) {
    try {
      const slide = req.body.slide;
      console.log(slide);
      if (slide) {
        let content;
        if (slide.typeId === 1) {
          const multipleChoice = await slideService.createMultipleChoice({
            slideId: slide.id,
            question: "",
          });
          const option = await slideService.createOption({
            contentId: multipleChoice.id,
            content: "",
          });
          const options = [option];
          content = {
            ...multipleChoice.dataValues,
            options,
          };
          console.log("content", content);
        } else if (slide.typeId === 2) {
          content = await slideService.createHeading({
            slideId: slide.id,
            heading: "",
            subHeading: "",
          });
        } else {
          content = await slideService.createParagraph({
            slideId: slide.id,
            heading: "",
            paragraph: "",
          });
        }
        return res.status(200).json({
          success: true,
          message: "Change slide type successfully.",
          data: {
            ...slide,
            contentId: content.id,
            content: content,
          },
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Slide not found.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  // [DELETE] /slides/:id/content/:contentId/delete
  deleteSlideContent = async function (req, res) {
    try {
      const slideId = req.params.id;
      const contentId = req.params.contentId;

      const slide = await slideService.getSlideById(slideId);

      if (slide) {
        if (slide.typeId === 1) {
          await slideService.deleteMultipleChoice({ id: contentId, slideId });
          await slideService.deleteOption({ contentId: contentId });
        } else if (slide.typeId === 2) {
          await slideService.deleteHeading({ id: contentId, slideId });
        } else {
          await slideService.deleteParagraph({ id: contentId, slideId });
        }
        return res.status(200).json({
          success: true,
          message: "Delete slide type successfully.",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Slide not found.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  // [DELETE] /:id/delete
  deleteSlide = async function (req, res) {
    try {
      const slideId = req.params.id;

      await slideService.deleteSlide(slideId);
      return res.status(201).json({
        success: true,
        message: `Delete slide ${slideId} successfully.`,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
}

module.exports = new SlideController();
