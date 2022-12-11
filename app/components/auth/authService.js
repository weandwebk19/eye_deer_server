const db = require("../../models");
const models = db.sequelize.models;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const sendVerifyEmail = require("../../utils/sendVerifyEmail");

class AuthService {
  generateHashUserIdToken = function (userId) {
    return jwt.sign(
      {
        userId,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: process.env.JWT_VERIFY_EXPIRATION }
    );
  };

  sendVerifyEmail = async (email, userId) => {
    try {
      const subject = "[Eye Deer] - Email Verification";
      const content = `Please click on the link below to verify your email address. </br> This is required to confirm ownership of the email address.`;
      const hash = this.generateHashUserIdToken(userId);
      const link = `${process.env.BACKEND_BASE_URL}/auth/user/verify/${hash}`;
      const rejectLink = `${process.env.BACKEND_BASE_URL}/auth/user/cancel/${hash}`;
      await sendVerifyEmail(email, subject, content, link, rejectLink);
    } catch (error) {
      console.log("Send email error: " + error.message);
    }
  };
}

module.exports = new AuthService();
