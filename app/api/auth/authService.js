const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../../models');
const models = db.sequelize.models;
const Op = db.Sequelize.Op;

class AuthService {
    getUserByUsername = async (username) => {
        const user = await models.User.findOne({
            where: {
                username: username
            },
            raw: true
        });
        return user;
    }

    createUser = async (body) => {
        const hashPassword = await bcrypt.hash(body.password, saltRounds);
        return await models.User.create(
            {
                username: body.username, 
                password: hashPassword, 
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                address: body.address,
                phone: body.phone,
                birthday: body.birthday,
                roleId: body.roleId,
                workplaceId: body.workplaceId
            }
        );
    }
}

module.exports = new AuthService;