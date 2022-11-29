const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("../../models");
const models = db.sequelize.models;
const Op = db.Sequelize.Op;
const sendVerifyEmail = require("../../utils/sendVerifyEmail");

class AuthService {
  storeHashEmail = async (user) => {
    const email = user.email;
    const userId = user.id;
    const hash = await bcrypt.hash(userId, saltRounds);
    await this.sendVerifyEmail(email, hash);
    await models.VerifyUser.create({
      userId,
      hash,
    });
  };

  sendVerifyEmail = async (email, hash) => {
    try {
      const subject = "[Eye Deer] - Email Verification";
      const content = `Please click on the link below to verify your email address. </br> This is required to confirm ownership of the email address.`;
      const link = `${process.env.BACKEND_BASE_URL}/auth/user/verify?hash=${hash}`;
      await sendVerifyEmail(email, subject, content, link);
    } catch (error) {
      console.log("Send email error: " + error.message);
    }
  };

  activeUser = async (hash) => {
    const userVerify = await models.VerifyUser.findOne({
      where: { hash: hash },
    });
    if (userVerify === null) {
      console.log("Hash not found");
      return false;
    } else {
      await models.User.update(
        { active: true },
        { where: { id: userVerify.userId } }
      );
      await models.VerifyUser.destroy({ where: { hash: hash } });
      return true;
    }
  };
}

module.exports = new AuthService();
