/** @format */

const { UserGames,UserGamesBiodata, UserGamesHistory } = require('./../models');
const bcrypt = require("bcryptjs");
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await UserGames.findOne({ where: { username: username }},{
        include:
          [
            { model: UserGamesBiodata, as: "biodata" },
            { model: UserGamesHistory, as: "history" }
          ]
      });
      if (!user) {
        return done(null, false, { message: 'username not found ! Please try again' });
      }
      const passVal = await bcrypt.compare(password, user.password);
      if (!passVal) {
        return done(null, false, { message: `password does not match ! Please try again` });
      }
      return done(null, user);
    } catch (err) {
      //return done(err);
      return done(null, false, { message: err });
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  UserGames.findByPk(id).then(function (user) {
    done(null, user);
  });
});
