const { UserGames, UserGamesBiodata, UserGamesHistory } = require("../../models")
const jwt = require('jsonwebtoken')
const moment = require('moment')
const privateKey = 'challeng-bejs'
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid')

exports.login = async (req, res) => {
    let { username, password } = req.body
    let user_games = await UserGames.findOne({ where: { username: username } })
    if (!user_games?.username) {
        return res.status(200).json({
            'message': 'Username not found'
        })
    }

    var passwordIsValid = bcrypt.compareSync(
        password,
        user_games?.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

    let token = jwt.sign({
        id: user_games?.id,
        username: username,
        email: user_games?.email,
        profil: user_games?.profil,
        role_id: user_games?.role_id,
    }, privateKey, {
        expiresIn: '1d'
    });

    // await UserGames.update({
    //     token: token
    // }, {
    //     where: {
    //         id: user_games.id
    //     }
    // })

    req.session.token = token

    return res.status(200).json({
        'message': 'Username & Password is Correct',
        'data': {
            'token': token,
            'expired_at': moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
        }
    })
}

// const validateUsername = username => {
//   return UserGames.findOne({
//     where: {
//       username: username
//     }
//   })
// }

// const validateEmail = email => {
//   return UserGames.findOne({
//     where: {
//       email: email
//     }
//   })
// }

exports.register = async (req, res) => {
    let { username, password, email,role_id } = req.body
    const uid = uuidv4()
    const now = new Date();

    UserGames.findOne({
    where: {
      username: username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    }
    // Email
    UserGames.findOne({
      where: {
        email: email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }
      UserGames.create({
        uid,
        username,
        password: bcrypt.hashSync(password, 8),
        email,
        role_id,
        now,
        now,
      })
        .then((data) => {
          res.status(201).json({
            success: "Success insert data user games",
            dataInsert: data,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message : error.message
          });
        });
    });
  });
}


