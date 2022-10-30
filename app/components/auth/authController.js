const authService = require('./authService');
const jwt = require('jsonwebtoken');
const rediscl = require('../../redis');

class AuthController {
    //[POST] /register
    register = async function(req, res) {
        const { username, password } = req.body;
        try {
            //Username or password is not available
            if (!username || !password) {
               res.status(204).json({
                success:false,
                data: {
                    message: 'Invalid username or password'
                }
               });
            } else {
                //Check if the user already exists
                const existedUser = await authService.getUserByUsername(username);
                if (!existedUser) {
                    //create a new user
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

    generateAccessToken = function(user) {
        return jwt.sign(
            {
                id: user.id,
                roleId: user.roleId,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: process.env.JWT_ACCESS_EXPIRATION}
        );
    }

    generateRefreshToken = function(user) {
        return jwt.sign(
            {
                id: user.id,
                roleId: user.roleId,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: process.env.JWT_REFRESH_EXPIRATION}
        );
    }

    //[POST] /login
    login = async function(req, res) {
        try{
            const user = req.user;
            const  accessToken = this.generateAccessToken(user);
            const  refreshToken = this.generateRefreshToken(user);
            const  {password, ...responseUser} = user;

            //set the refresh token to redis
            rediscl.set(user.id, JSON.stringify({
                refreshToken,
                expires: process.env.JWT_REFRESH_EXPIRATION
                })
            );
            //set cookies refreshtoken
            res.cookie("x-refresh-token", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict"
            })
            res.status(200).json({
                user: responseUser,
                accessToken
            });
        }
        catch(err) {
            res.status(500).json(err.message);
        }
    }

    //[POST] /refresh
    refreshToken = function(req, res) {
        //Take refresh token from user
        const refreshToken = req.cookies['x-refresh-token'];
        if(!refreshToken) {
            return res.status(401).json("You are not authenticated");
        }

        //verify refresh token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if(err) {
                return res.status(403).json(err.message);
            }

            //Check refresh token is exists on redis
            rediscl.get(user.id, (err, reply) => {
                if(err) {
                    return res.status(403).json("Refresh token is not valid");
                }
                //delete old refresh token
                rediscl.del(user.id, (err, reply) => {
                    if(err) {
                        return res.status(403).json(err.message);
                    }
                })
            })

            //generate new token
            const newAccessToken = this.generateAccessToken(user);
            const newRefreshToken = this.generateRefreshToken(user);

            //set the new refresh token to redis
            rediscl.set(user.id, JSON.stringify({
                refreshToken: newRefreshToken,
                expires: process.env.JWT_REFRESH_EXPIRATION
                })
            );

            //set new refresh token to cookie
            res.cookie("x-refresh-token", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict"
            });

            res.status(200).json({accessToken: newAccessToken});
        })

    }

    //[POST] /logout
    logout = async (req, res) => {
        const user = req.user;
        res.clearCookie("x-refresh-token");
        //delete refresh token in redis
        rediscl.del(user.id, (err, reply) => {
            if(err) {
                return res.status(403).json(err.message);
            }
        });
        res.status(200).json("Logged out");
    }
}

module.exports = new AuthController;