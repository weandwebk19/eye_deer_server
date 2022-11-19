const userService = require('./userService');
const bcrypt = require('bcrypt');
const uploadImage = require('../../utils/cloudinary');

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

    //[POST] /user/profile/:username
    updateProfileUser = async (req, res) => {
        try{
            const [username, password] = [req.params.username, req.body.currentPassword];

            //check user
            const user = await userService.getUserByUsername(username);
            const match = await bcrypt.compare(password, user.password);

            if(!match){
                res.status(401).json({success: false, message: "Password incorrect!"});
                return;
            }


            //save avatar
            const avatarLink = req.file ? await uploadImage(req.file.path) : null;

            //udpate profile user
            const userInfo = {...req.body, avatarLink};
            await userService.updateProfileUser(username, userInfo);

            res.status(200).json({success: true, message: "Update successfully!"});
        }
        catch(error){
            console.log(error);
            res.status(500).json({success: false, message: "Server error!"});
        }
    }


}

module.exports = new UserController;