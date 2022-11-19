const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../../models');
const models = db.sequelize.models;
const sequelize = db.sequelize;

class UserService {
    getUserByUsername = async (username) => {
        const user = await models.User.findOne({
            where: {
                username: username
            },
            raw: true
        });
        return user;
    }

    getUserByEmail = async (email) => {
        const user = await models.User.findOne({
            where: {
                email: email
            },
            raw: true
        });
        return user;
    }

    getUserById = async (id) => {
        const user = await models.User.findOne({
            where: {
                id: id
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
                firstName: body.firstName?body.firstName:null,
                lastName: body.lastName?body.lastName:null,
                email: body.email?body.email:null,
                address: body.address?body.address:null,
                phone: body.phone?body.phone:null,
                birthday: body.birthday?body.birthday:null,
                roleId: body.roleId,
                workplaceId: body.workplaceId?body.workplaceId:null
            }
        );
    }

    async updateProfileUser(username, userInfo){
        try{
            const subSqlPicture = userInfo.avatarLink 
                ? `, picture = '${userInfo.avatarLink}'` 
                : (userInfo.isDeleteAvatar === "true"
                        ?  `, picture = null`
                        : '');
            console.log(userInfo.isDeleteAvatar, subSqlPicture);
            const sql = 
                `update users
                set firstName = N'${userInfo.firstName}', lastName = N'${userInfo.lastName}', 
                email = '${userInfo.email}' ${subSqlPicture}
                where users.username = '${username}'`;

            await sequelize.query(sql);
        }
        catch(error){
            console.log(error);
        }
    }
}

module.exports = new UserService;