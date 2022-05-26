const { UserGames, UserGamesBiodata, UserGamesHistory } = require("../../models");
const moment = require("moment");
const bcrypt = require("bcryptjs");

exports.viewprofile = (req, res) => {
  let user_current = req.user.dataValues
  console.log(user_current)
  const id = user_current.id;
  console.log(id)
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
      console.log(user_games)
      res.status(200).render("pages/profile", { user_games,moment,user_current});
    })
    .catch((error) => {
      res.status(500).render('errors/error', { status: 500,message:  error.message})
    });
};

exports.insertprofile = (req, res) => {
  let user_current = req.user.dataValues
  console.log(user_current)
  const id = user_current.id;
  console.log(id)
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
      console.log(user_games)
      res.status(200).render("pages/profile-insert", { user_games,moment,user_current});
    })
    .catch((error) => {
      res.status(500).render('errors/error', { status: 500,message:  error.message})
    });
};

exports.create = (req, res, next) => {
  let { user_id, fullname, gender, date_of_birth, place_of_birth, address } = req.body

  const checkUserGames = (user_id, success, failed) => {
    UserGames.findOne({ where: { id: user_id } }).then((UserGames) => {
      return success(UserGames)
    }).catch((err) => {
      return failed(err)
    })
  }

  checkUserGames(user_id, (data) => {
    if (!data) {
      return res.status(200).render('errors/error', { status: 200,message: 'User game id not found' })
    }

    UserGamesBiodata.create({
      user_id: user_id,
      fullname: fullname,
      gender: gender,
      date_of_birth: date_of_birth,
      place_of_birth: place_of_birth,
      address: address,
    }).then((userbiodata) => {
        res.status(201).redirect(`/profile`);
    }).catch((error) => {
      res.status(500).render('errors/error', { status: 500,message: error.message })
    })
  }, (error) => {
    //console.log(error)
    return res.status(400).render('errors/error', { status: 400,message: 'Failed' })
  })
};

exports.editprofile = (req, res) => {
  let user_current = req.user.dataValues
  console.log(user_current)
  const id = user_current.id;
  console.log(id)
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
      console.log(user_games)
      res.status(200).render("pages/profile-update", { user_games,moment,user_current});
    })
    .catch((error) => {
      res.status(500).render('errors/error', { status: 500,message:  error.message})
    });
};


exports.update =  (req, res, next) => {
  let id= req.body?.id;
  let userbiodata_data = {
    id: req.body?.id,
    user_id: req.body?.user_id,
    fullname: req.body?.fullname,
    gender: req.body?.gender,
    date_of_birth: req.body?.date_of_birth,
    place_of_birth: req.body?.place_of_birth,
    address: req.body?.address,
  }
  let query = {
    where: {
      id: id
    }
  }
  const checkUserGames = (user_id, success, failed) => {
    UserGames.findOne({ where: { id: user_id } }).then((UserGames) => {
      return success(UserGames)
    }).catch((err) => {
      res.status(500).render('errors/error', { status: 500,message: error.message })
    })
  }

  const checkBefore = (id, success, failed) => {
    UserGamesBiodata.findOne({ where: { id: id } }).then((userbiodata) => {
      return success(userbiodata)
    }).catch((err) => {
      res.status(500).render('errors/error', { status: 500,message: error.message })
    })
  }

  checkUserGames(userbiodata_data.user_id, (data) => {
    if (!data) {
      if (!data) {
        return res.status(200).render('errors/error', { status: 200,message: 'User game id not found' })
      }
    }

    checkBefore(id, (data) => {
      if (!data) {
        if (!data) {
          return res.status(200).render('errors/error', { status: 200,message: 'Data not found' })
        }
      }

      UserGamesBiodata.update(userbiodata_data, query).then((userbiodata_data) => {
        return res.status(200).redirect(`/user-games/biodata/${userbiodata_data.user_id}`);
      }).catch((error) => {
        res.status(500).render('errors/error', { status: 500,message: error.message })
      });
    }, (err) => {
      return res.status(400).render('errors/error', { status: 400,message: error.message })
    })
  }, (err) => {
    return res.status(400).render('errors/error', { status: 400,message: error.message })
  })
};

//history
exports.create = (req, res, next) => {
  let { user_id, score, session_start, session_end } = req.body

  const checkUserGames = (user_id, success, failed) => {
    UserGames.findOne({ where: { id: user_id } }).then((UserGames) => {
      return success(UserGames)
    }).catch((err) => {
      return failed(err)
    })
  }

  checkUserGames(user_id, (data) => {
    if (!data) {
      return res.status(200).render('errors/error', { status: 200,message: "User game id not found!" })
    }

    let playtime = getIntervalTime(session_end, session_start)

    UserGamesHistory.create({
      user_id: user_id,
      score: score,
      session_start: session_start,
      session_end: session_end,
      playtime: playtime
    }).then((userhistory) => {
      return res.status(201).redirect(`/profile`);
    }).catch((error) => {
      res.status(500).render('errors/error', { status: 500,message: error.message })
    });
  }, (error) => {
    //console.log(error)
    return res.status(400).render('errors/error', { status: 400,message: 'Failed' })
  })
};

exports.getUserGamesBiodataById = (req, res, next) => {
  const id = req.params.id;
  let user_current = req.user.dataValues
  UserGamesBiodata.findOne({
    include: [{model: UserGames, as : "user"}],
    where: { user_id: user_current.id }
  })
    .then((user_games_biodata) => {
      let user_current = req.user.dataValues
      res.status(400).render("pages/profile",{user_id:id,user_current})
    })
    .catch((error) => {
      res.status(500).render('errors/error', { status: 500,message: error.message })
    });
};

//UPDATE ACC
exports.show = (req, res, next) => {
  let user_current = req.user.dataValues
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
      //let user_current = req.user.dataValues
      res.status(200).render("pages/setting", { user_games,moment,user_current});
    })
    .catch((error) => {
      res.status(500).render('errors/error', { status: 500,message:  error.message})
    });
};

exports.updateUserGames = (req, res, next) => {
  const { username, password, email } = req.body;
  const now = new Date();
  let user_current = req.user.dataValues
  UserGames.findByPk(user_current.id)
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
          where: { id:user_current.id },
        }
      );
      res.status(201).redirect("/profile/account");
    })
    .catch((error) => {
      res.status(500).render('errors/error', { status: 500,message:  error.message})
    });
};