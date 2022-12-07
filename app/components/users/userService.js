const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("../../models");
const models = db.sequelize.models;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

class UserService {
  getAllUsers = async () => {
    const users = await models.User.findAll({
      raw: true,
    });
    return users;
  };

  getUsers = async (query) => {
    const users = await models.User.findAll({
      where: {
        [Op.or]: [
          { id: query.id ? query.id : null },
          { username: query.username ? query.username : null },
          { email: query.email ? query.email : null },
          { firstName: query.firstName ? query.firstName : null },
          { lastName: query.lastName ? query.lastName : null },
        ],
      },
      raw: true,
    });
    return users;
  };

  getSearchUsers = async (term) => {
    const users = await models.User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `${term}%` } },
          { email: { [Op.like]: `${term}%` } },
        ],
      },
      raw: true,
      limit: 10,
    });
    return users;
  };

  getUserByUsername = async (username) => {
    const user = await models.User.findOne({
      where: {
        username: username,
      },
      raw: true,
    });
    return user;
  };

  getUserByEmail = async (email) => {
    const user = await models.User.findOne({
      where: {
        email: email,
      },
      raw: true,
    });
    return user;
  };

  getUserById = async (id) => {
    const user = await models.User.findOne({
      where: {
        id: id,
      },
      raw: true,
    });
    return user;
  };

  createUser = async (body) => {
    const hashPassword = await bcrypt.hash(body.password, saltRounds);
    return await models.User.create({
      ...body,
      password: hashPassword,
    });
  };

  async updateProfileUser(username, userInfo) {
    try {
      const subSqlPicture = userInfo.avatarLink
        ? `, picture = '${userInfo.avatarLink}'`
        : userInfo.isDeleteAvatar === "true"
        ? `, picture = null`
        : "";
      console.log(userInfo.isDeleteAvatar, subSqlPicture);
      const sql = `update users
                set firstName = N'${userInfo.firstName}', lastName = N'${userInfo.lastName}', 
                email = '${userInfo.email}' ${subSqlPicture}
                where users.username = '${username}'`;

      await sequelize.query(sql);
    } catch (error) {
      console.log(error);
    }
  }

  activeUser = async (userId) => {
    try {
      await models.User.update(
        { verifyStatus: true },
        { where: { id: userId } }
      );
      return true;
    } catch (error) {
      return false;
    }
  };

  destroyUser = async (userId) => {
    try {
      await models.User.destroy({ where: { id: userId } });
      return true;
    } catch (error) {
      return false;
    }
  };

  getVerifyStatus = async (userId) => {
    try {
      const user = await models.User.findOne({
        attributes: ["verifyStatus"],
        where: {
          id: userId,
        },
        raw: false,
      });
      if (user) {
        return user.verifyStatus;
      }
    } catch (error) {
      return error;
    }
  };
}

module.exports = new UserService();
