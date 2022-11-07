const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../../models');
const models = db.sequelize.models;
const Op = db.Sequelize.Op;

class AuthService {
    

    // getOAuthByID = async (id) => {
    //     const account = await models.OAuth_Account.findOne({
    //         where: {
    //             id: id
    //         },
    //         raw: true
    //     });
    //     return account;
    // }



    // createOAuthAccount = async(body) => {
    //     return await models.OAuth_Account.create({
    //         id: body.id,
    //         sub: body.sub,
    //         email_verified: body.email_verified,
    //         locale: body.locale
    //     })
    // }
}

module.exports = new AuthService;