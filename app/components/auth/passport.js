const passport = require("passport");
const bcrypt = require("bcrypt");
const db = require("../../models");
const models = db.sequelize.models;
const Account = models.user;
require("dotenv").config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new LocalStrategy(function (username, password, done) {
    Account.findOne({
      where: {
        username: username,
      },
      raw: true,
    })
      .then(async function (user) {
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const match = await validPassword(user, password);
        if (!match) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      })
      .catch((err) => done(err));
  })
);

/*  Google AUTH  */
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      console.log(userProfile);
      console.log("accessToken: " + accessToken);
      console.log("refreshToken: " + refreshToken);
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

async function validPassword(user, password) {
  return await bcrypt.compare(password, user.password);
}
module.exports = passport;
