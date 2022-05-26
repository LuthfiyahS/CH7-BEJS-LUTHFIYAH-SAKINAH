const { UserGames, UserGamesBiodata, UserGamesHistory } = require("../../models");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid')
const jwt =require('jsonwebtoken')
//API media 
const isBase64 = require('is-base64');
const base64Img = require('base64-img');
const fs = require('fs');

exports.getUserGames = async (req, res) => {
  const user = await UserGames.findAll({
    include:
      [
        { model: UserGamesBiodata, as: "biodata" },
        { model: UserGamesHistory, as: "history" }
      ]
  });
  const mappedUser = user.map((m) => {
    if (!m.profil) {
      return m;
    } else {
      m.profil = `${req.get('host')}/file/${m.profil}`;
      return m;
    }
  })
  return res.json({
    status: "Success",
    data: mappedUser
  });
};

exports.addUserGames = (req, res) => {
  const { username, password, email, profil } = req.body;
  createUser(req, res, username, password, email, profil);
};

exports.createUserGames = (req, res) => {
  const { username, password, email, profil } = req.query;
  createUser(req, res, username, password, email, profil);
};

const createUser = (req, res, username, password, email, profil) => {
  //const { username, password, email, profil} = req.query;
  const now = new Date();
  const uid = uuidv4()

  if (profil == null) {
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
            res.status(500).json({ message: error.message });
          });
      });
    });
  } else {
    if (!isBase64(profil, { mimeRequired: true })) {
      return res.status(400).json({ status: 'error', message: 'Invalid base64' });
    }

    base64Img.img(profil, './public/file/images', `profil-${Date.now()}`, (err, filepath) => {
      if (err) {
        return res.status(400).json({ status: 'error', message: err.message });
      }

      const filename = filepath.split("\\").pop().split("/").pop();

      UserGames.findOne({ username }).then(user => {
        if (user) {
          res.status(400).send({
            message: "Failed! Username is already in use!"
          });
          return;
        }
        // Email
        UserGames.findOne({ email }).then(user => {
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
            profil: filename,
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
              res.status(500).json({ message: error.message });
            });
        });
      });
    })
  }
};

exports.getUserGamesById = (req, res, next) => {
  const id = req.params.id;
  const token = req?.headers['authorization']
  const newStr = token.replace('Bearer ', '');
  const role  = jwt.decode(newStr);
  console.log(role)
    if (role.role_id == 3 && id != role.id) {
        return res.status(401).json({
            'message': 'Unauthorized KAMU BUKAN KE1'
        })
    }
  UserGames.findByPk(id, {
    include:
      [
        { model: UserGamesBiodata, as: "biodata" },
        { model: UserGamesHistory, as: "history" }
      ]
  })
    .then((usergames) => {
      if (!usergames) {
        const error = new Error(`Could not find user games with id = ${id}`);
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        success: `Success find user games with id = ${id}`,
        data: usergames,
      });
    })
    .catch((error) => {
      if (!error.status) error.status = 500;
      next(error);
    });
};

exports.updateUserGames = (req, res, next) => {
  const id = req.params.id;
  const { username, password, email, profil } = req.body;
  const now = new Date();
  UserGames.findByPk(id)
    .then((usergames) => {
      if (!usergames) {
        return res.status(404).json({
          status: 'error',
          message: `Could not find user games with id = ${id}`
        });
      }
      if (profil == null) {
        UserGames.update(
          {
            username,
            password: bcrypt.hashSync(password, 8),
            email,
            now,
          },
          {
            where: { id },
          }
        );
        res.status(200).json({
          success: `Success update user games with id = ${id}`
        });
      } else {
        if (!isBase64(profil, { mimeRequired: true })) {
          return res.status(400).json({ status: 'error', message: 'Invalid base64' });
        }

        base64Img.img(profil, './public/file/images', `profil-${Date.now()}`, (err, filepath) => {
          if (err) {
            return res.status(400).json({ status: 'error', message: err.message });
          }

          const filename = `${filepath.split("\\").pop().split("/").pop()}`;
          UserGames.update(
            {
              username,
              password: bcrypt.hashSync(password, 8),
              email,
              profil: filename,
              now,
            },
            {
              where: { id },
            }
          );
          res.status(200).json({
            success: `Success update user games with id = ${id}`
          });
        })
      }

    })
    .catch((error) => {
      if (!error.status) error.status = 500;
      next(error);
    });
};

exports.deleteUserGames = (req, res, next) => {
  const { id } = req.params;

  UserGames.findByPk(id)
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          status: 'error',
          message: `Could not find user games with id = ${id}`
        });
      }

      if (!data.profil) {
        UserGames.destroy({
          where: { id },
        })

        res.status(200).json({
          status: 'Succes',
          message: `Success delete user games with id = ${id}`
        })
      } else {
        fs.unlink(`./public/file/${data.profil}`, (err) => {
          if (err) {
            return res.status(404).json({ status: 'error', message: err.message });
          }

          UserGames.destroy({
            where: { id },
          })

          res.status(200).json({
            status: 'Succes',
            message: `Success delete user games with id = ${id}`
          })
        });
      }
    })
    .catch((error) => {
      if (!error.status) error.status = 500;
      next(error);
    });
};
