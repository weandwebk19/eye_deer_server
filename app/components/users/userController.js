const userService = require('./userService')

class UserController {
    //[GET] /user?username={username
    getUserByUsername = async (req, res) => {
        const params = req.params;
        if(params.username !== undefined) {
            const user = await userService.getUserByUsername(params.username);
            res.status(200).json(user);
        }
        else {
            res.status(404);
        }
    }

    //[GET] /user?email={email}
    getUserByEmail = async (req, res) => {
        const params = req.params;
        console.log(params)
        if(params.email !== undefined) {
            const user = await userService.getUserByEmail(params.email);
            res.status(200).json(user);
        }
        else {
            res.status(404);
        }
    }
}

module.exports = new UserController;