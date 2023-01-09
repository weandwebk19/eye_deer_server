const passport = require("./passport");
const jwt = require("jsonwebtoken");

class AuthMiddleware {
  //authenticate the user with the provided credentials using passport
  passportAuthentication = async function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: info.message });
      }
      req.user = user;
      next();
    })(req, res, next);
  };

  //authenticate the user with the google credentials using passport
  googleAuth = async function (req, res, next) {
    passport.authenticate("google", function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: info.message });
      }
      req.user = user;
      next();
    })(req, res, next);
  };

  //Check if the user is authenticated
  verifyToken = function (req, res, next) {
    const token = req.headers["x-access-token"];
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json("Token is invalid");
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("You are not authenticated");
    }
  };
}

module.exports = new AuthMiddleware();
