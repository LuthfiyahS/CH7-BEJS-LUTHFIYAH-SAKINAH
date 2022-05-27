const { UserGames, UserGamesBiodata, UserGamesHistory, RoleUser } = require("../../models");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid')
exports.index = (req, res, next) => {
  let user_current = req.user.dataValues
  if(user_current.role_id != 1){
    UserGames.findByPk(user_current.id, {
      include:
        [
          { model: UserGamesBiodata, as: "biodata" },
          { model: UserGamesHistory, as: "history" },
          { model: RoleUser, as: "role" }
        ]
      })
      .then((user_games) => {
        res.status(200).render("pages/user_games", { user_games,moment,user_current});
      })
  }
  UserGames.findAll({include:
    [
      { model: UserGamesBiodata, as: "biodata" },
      { model: UserGamesHistory, as: "history" },
      { model: RoleUser, as: "role" }
    ]
  })
    .then((user_games) => {
      if(user_games){
        //console.log(user_current)
        res.status(200).render('pages/user_games/', { user_games,moment,user_current })
      }else{
        res.status(404).render('error', { status: res.status(404),error:'Data tidak ditemukan' })
      }
    })
    .catch((error) => {
      res.status(500).render('error', { status: res.status(500),error: error.message })
    });
};

exports.addUserGames = (req, res, next) => {
  let user_current = req.user.dataValues
  if(user_current.role_id == 1){
  res.status(200).render("pages/user_games/add",{user_current})
  }else{
    res.status(201).redirect("/user-games");
  }
};

exports.createUserGames = (req, res, next) => {
  const { username, password, email } = req.body;
  const now = new Date();
  const uid = uuidv4()
  if(user_current.role_id != 1){
    res.status(201).redirect("/user-games");
  }
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
        profil:req.files[0].filename,
        video:req.files[1].filename,
        now,
        now,
      })
        .then((data) => {
          res.status(201).redirect("/user-games");
        })
        .catch((error) => {
          res.status(500).render('errors/error', { status: 500,message: error.message })
        });
    });
  });

};
exports.show = (req, res, next) => {
  const id = req.params.id;
  let user_current = req.user.dataValues
  if(user_current.role_id != 1){
    UserGames.findByPk(user_current.id, {
      include:
        [
          { model: UserGamesBiodata, as: "biodata" },
          { model: UserGamesHistory, as: "history" }
        ]
    })
      .then((user_games) => {
        if (!user_games) {
          res.status(404).render('errors/error', { status: 404,message: "Failed! Data Not Found!" })
        }
        res.status(200).render("pages/user_games/update", { user_games,moment,user_current});
      })
  }else{
  UserGames.findByPk(id, {
    include:
      [
        { model: UserGamesBiodata, as: "biodata" },
        { model: UserGamesHistory, as: "history" }
      ]
  })
    .then((user_games) => {
      if (!user_games) {
        res.status(404).render('errors/error', { status: 404,message: "Failed! Data Not Found!" })
      }
      res.status(200).render("pages/user_games/update", { user_games,moment,user_current});
    })
    .catch((error) => {
      res.status(500).render('errors/error', { status: 500,message:  error.message})
    });
  }
};

exports.updateUserGames = (req, res, next) => {
  const id = req.params.id;
  const { username, password, email } = req.body;
  const now = new Date();
  UserGames.findByPk(id)
    .then((usergames) => {
      if (!usergames) {
        res.status(404).render('errors/error', { status: 404,message: "Failed! Data Not Found!" })
      }
      UserGames.update(
        {
          username,
          password: bcrypt.hashSync(password, 8),
          profil:req.files[0].filename,
          video:req.files[1].filename,
          email,
          now,
        },
        {
          where: { id },
        }
      );
      res.status(201).redirect("/user-games");
    })
    .catch((error) => {
      res.status(500).render('errors/error', { status: 500,message:  error.message})
    });
};

exports.deleteUserGames = async (req, res, next) => {
  const { id } = req.params;
  UserGames.findByPk(id)
    .then((data) => {
      if (!data) {
        res.status(404).render('errors/error', { status: 404,message: "Failed! Data Not Found!" })
      }
      UserGames.destroy({
        where: { id },
      });
      res.status(201).redirect("/user-games");
    })
    .catch((error) => {
      res.status(500).render('errors/error', { status: 500,message:  error.message})
    });
};
