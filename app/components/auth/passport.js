const bcrypt = require('bcrypt');
const db = require('../../models');
const models = db.sequelize.models;
const Account = models.User;

const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (username, password, done) {
    Account.findOne({
      where: {
        username: username
      },
      raw: true
    })
      .then(async function (user) {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        const match = await validPassword(user, password);
        if (!match) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      })
      .catch((err) => done(err));
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

async function validPassword(user, password) {
  return await bcrypt.compare(password, user.password);
}

module.exports = passport;