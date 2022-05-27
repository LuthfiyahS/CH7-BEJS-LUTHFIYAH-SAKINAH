const { UserGames, UserGamesBiodata, UserGamesHistory } = require("../../models");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid')
exports.login = (req, res) => {
    res.render('login')
}

exports.register = (req, res) => {
    res.render('register')
}

exports.registerproses = (req, res, next) => {
    const { username, password, email } = req.body;
    const now = new Date();
    const uid = uuidv4()
    UserGames.findOne({
      where: {
        username: username
      }
    }).then(user => {
      if (user) {
        res.status(400).render('errors/error', { status: 400,message: "Failed! Username is already in use!" })
        return;
      }
      // Email
      UserGames.findOne({
        where: {
          email: email
        }
      }).then(user => {
        if (user) {
          res.status(400).render('errors/error', { status: 400,message: "Failed! Email is already in use!" })
          return;
        }
        UserGames.create({
          uid,
          username,
          password: bcrypt.hashSync(password, 8),
          email,
          role_id: 2,
          now,
          now,
        })
          .then((data) => {
            res.status(201).redirect("login");
          })
          .catch((error) => {
            res.status(500).render('errors/error', { status: 500,message: error.message })
          });
      });
    });
  
  };

