const authService = require('./authService');
const userService = require('../users/userService');
const jwt = require('jsonwebtoken');
const rediscl = require('../../redis');

class AuthController {
    //[POST] /register
    register = async function(req, res) {
        const { username, password, email } = req.body;
        try {
            //Username or password is not available
            if (!username || !password) {
               res.status(204).json({
                success:false,
                message: 'Invalid username or password'
               });
            } else {
                //Check if the user already exists
                const existedUsername = await userService.getUserByUsername(username);
                const existedEmail = await userService.getUserByEmail(email);
                if (!existedUsername && !existedEmail) {
                    //create a new user
                    const newUser = await userService.createUser(req.body);
                    await authService.storeHashEmail({id: newUser.id, email: newUser.email});
                    res.status(201).json({
                        success:true,
                        message: 'Register successfully',
                        user: newUser
                    });
                } else {
                    res.status(200).json({
                        success:false,
                        message: 'User is already existed'
                    });
                }
            }
        } catch (err) {
            res.status(500).json({
                success:false,
                message: 'Register failed: ' + err.message
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
                secure: process.env.SERCURE_COOKIE,
                path: "/",
                sameSite: "strict"
            })
            res.status(200).json({
                user: responseUser,
                accessToken
            });
        }
        catch(err) {
            console.log(err);
            res.status(500).json({message: err.message});
        }
    }

    // [POST] /auth/oauth/login
    OAuthLogin = async function(req, res) {
        const account = req.body;
        try {
            //Check if the user already exists
            const existedAccount = await userService.getUserByEmail(account.email);
            if (existedAccount) {
                req.user = existedAccount;
                this.login(req, res);
            }
            else {
                //console.log("navigate to register")
                res.status(403).json({
                    success:false,
                    message: 'Login failed'
                });
            }
        } catch (err) {
            res.status(500).json({
                success:false,
                message: 'Login failed: ' + err.message
            });
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
                secure: process.env.SERCURE_COOKIE,
                path: "/",
                sameSite: "strict"
            });

            res.status(200).json({accessToken: newAccessToken});
        })
    }

    //[POST] /logout
    logout = (req, res) => {
        const user = req.user;
        res.clearCookie("x-refresh-token",
        {
            path: '/',
            sameSite: "strict",
            secure: process.env.SERCURE_COOKIE
        }
        );
        //delete refresh token in redis
        rediscl.del(user.id, (err, reply) => {
            if(err) {
                return res.status(403).json(err.message);
            }
        });
        res.status(200).json("Logged out");
    }

    //[GET] /auth/verify
    verifyEmail = async (req, res) => {
        const hash = req.params.hash;
        try{
            await authService.activeUser(hash);
            res.redirect(`${process.env.FRONTEND_BASE_URL}/register/confirmation?success=true`);
        }
        catch(err) {
            res.status(500).redirect(`${process.env.FRONTEND_BASE_URL}/register/confirmation?success=false`);
        }
    }
}

module.exports = new AuthController;