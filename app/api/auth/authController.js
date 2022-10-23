const authService = require('./authService');
class AuthController {
    //[POST] /register
    register = async function(req, res) {
        const { username, password } = req.body;
        try {
            if (!username || !password) {
               res.status(204).json({
                success:false,
                data: {
                    message: 'Invalid username or password'
                }
               });
            } else {
                const existedUser = await authService.getUserByUsername(username);
                if (!existedUser) {
                    await authService.createUser(req.body)
                    .then(result => {
                        res.status(201).json({
                            success:true,
                            data: {
                                message: 'Register successfully',
                                user: result
                            }
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            success:false,
                            data: {
                                message: 'Register failed: ' + err.message
                            }
                        });
                    })
                } else {
                    res.status(200).json({
                        success:false,
                        data: {
                            message: 'User is already existed'
                        }
                    });
                }
            }
        } catch (error) {
            res.status(500).json({
                success:false,
                data: {
                    message: 'Register failed: ' + err.message
                }
            });
        }
    }
}

module.exports = new AuthController;