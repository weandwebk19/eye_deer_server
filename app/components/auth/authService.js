const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../../models');
const models = db.sequelize.models;
const Op = db.Sequelize.Op;
const sendVerifyEmail = require('../../utils/sendVerifyEmail');

class AuthService {
    storeHashEmail = async(user) => {
        const email = user.email;
        const userId = user.id;
        const hash = await bcrypt.hash(userId, saltRounds);
        await this.sendVerifyEmail(email, hash);
        await models.VerifyUser.create({
            userId,
            hash
        });
    }

    sendVerifyEmail = async(email, hash) => {
        try {
            const link = `${process.env.BACKEND_BASE_URL}/auth/verify/${hash}`;
            await sendVerifyEmail(email, "[Eye Deer] - Email Verification", link);
        } catch (error) {
            console.log("Send email error: " + error.message);
        }
    }

    activeUser = async (hash) => {
        const userVerify = await models.VerifyUser.findOne({ where: { hash: hash } });
        if(userVerify === null) {
            console.log("Hash not found");
        }
        else {
            await models.User.update(
                {active: true},
                {where: {id: userVerify.userId}}
            );
            await models.VerifyUser.destroy({where: {hash: hash}});
        }
    }
}

module.exports = new AuthService;