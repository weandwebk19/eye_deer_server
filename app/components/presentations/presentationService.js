const db = require("../../models");
const models = db.sequelize.models;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");
const generatePresentationCode = require("../../utils/generatePresentationCode");

class PresentationService {
  generateCode = async () => {
    let newCode = generatePresentationCode();
    const count = await models.presentation.count({
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
    const newResource = await models.group_presentation.create({
      ...groupPresenataion,
    });

    return newResource;
  };

  createPresentation = async (presentation) => {
    const newCode = await this.generateCode();
    const newPresentation = await models.presentation.create({
      ...presentation,
      code: newCode,
    });

    return newPresentation;
  };

  getPresentationById = async (presentationId) => {
    const presentation = await models.presentation.findOne({
      where: { id: presentationId },
      raw: true,
    });

    return presentation;
  };

  removePresentationInGroup = async (groupId, presentationId) => {
    //remove reference to group of presentation in group_presentations table
    await models.group_presentation.destroy({
      where: {
        groupId,
        presentationId,
      },
    });
  };

  createUserVoted = async (userVoted) => {
    const newResource = await models.uservoted.create(userVoted);
    console.log("newResource", newResource);

    return newResource;
  };

  countUserVoted = async (userVoted) => {
    const findResource = await models.uservoted.count({
      where: {
        presentationId: userVoted.presentationId,
        slideId: userVoted.slideId,
        userId: userVoted.userId,
      },
      raw: true,
    });

    return findResource;
  };

  deleteUserVoted = async (userVoted) => {
    const findResource = await models.uservoted.destroy({
      where: {
        presentationId: userVoted.presentationId,
        slideId: userVoted.slideId,
      },
      force: true,
    });

    return findResource;
  };

  createChatMessage = async (message) => {
    const newResource = await models.ChatMessage.create(message);

    return newResource;
  };

  getListChatMessage = async (presentationId) => {
    const messages = await models.ChatMessage.findAll({
      where: { presentationId },
      raw: true,
    });

    return messages;
  };

  removePresentation = async (presentationId, userId) => {
    //soft remove presentation
    await models.presentation.destroy({
      where: {
        id: presentationId,
        userCreated: userId,
      },
    });
  };

  getPresentationsOfUser = async (userId) => {
    const sql = `select presentations.*, count(slides.id) as slides
                from presentations left join slides on presentations.id = slides.presentationId
                where presentations.userCreated = '${userId}' and presentations.deletedAt is null
                group by presentations.id`;

    const presentations = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return presentations;
  };

  getCoPresentationsOfUser = async (userId) => {
    const sql = `select presentations.*, count(distinct(slides.id)) as slides
                from presentations left join slides on presentations.id = slides.presentationId
                join group_presentations on presentations.id = group_presentations.presentationId
                join group_users on group_presentations.groupId = group_users.groupId and group_users.userId = '${userId}'
                where group_users.roleId = 2 and presentations.userCreated != '${userId}'
                and presentations.deletedAt is null
                group by presentations.id`;

    const coPresentations = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return coPresentations;
  };

  findPresentationsByName = async (userId, namePresentation) => {
    const sql = `select presentations.*, count(slides.id) as slides
                from presentations left join slides on presentations.id = slides.presentationId
                where presentations.userCreated = '${userId}' and presentations.name like '%${namePresentation}%'
                and presentations.deletedAt is null
                group by presentations.id`;

    const presentations = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return presentations;
  };

  createChatQuestion = async (question) => {
    const newResource = await models.chatquestion.create(question);

    return newResource;
  };

  getListChatQuestion = async (presentationId) => {
    const questions = await models.chatquestion.findAll({
      where: { presentationId },
      raw: true,
    });

    return questions;
  };

  updateMarkAsAnswered = async (questionId) => {
    await models.chatquestion.update(
      { isAnswered: true },
      { where: { id: questionId } }
    );
  };

  updateRestoreQuestion = async (questionId) => {
    await models.chatquestion.update(
      { isAnswered: false },
      { where: { id: questionId } }
    );
  };
  updatePresentation = async (presentationId, presentationName, status) => {
    await models.presentation.update(
      { name: presentationName, status },
      {
        where: {
          id: presentationId,
        },
      }
    );
  };
}

module.exports = new PresentationService();
