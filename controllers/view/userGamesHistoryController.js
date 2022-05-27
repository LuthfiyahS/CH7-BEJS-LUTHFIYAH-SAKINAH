const { UserGamesHistory,UserGames } = require("../../models");
const getIntervalTime = require('./../time')
const moment = require("moment");

exports.get = (req, res, next) => {
  UserGamesHistory.findAll({ include: [{model: UserGames, as : "user"}] })
    .then((user_games_history) => {
      let user_current = req.user.dataValues
      res.status(200).render('pages/user_games_history/', { user_games_history,moment,user_current})
    })
    .catch((error) => {
      res.status(500).render('errors/error', { status: 500,message: error.message })
    });
};
exports.add = (req, res, next) => {
    let user_current = req.user.dataValues
    UserGames.findAll()
    .then((user_games) => {
      res.render("pages/user_games_history/add",{user_games,user_current})
    })
    .catch((error) => {
      res.status(500).render('errors/error', { status: 500,message: error.message })
    });
  };
  
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
      return res.status(201).redirect(`/user-games/history/${user_id}`);
    }).catch((error) => {
      res.status(500).render('errors/error', { status: 500,message: error.message })
    });
  }, (error) => {
    //console.log(error)
    return res.status(400).render('errors/error', { status: 400,message: 'Failed' })
  })
};

exports.getUserGamesHistoryById = (req, res, next) => {
  const id = req.params.id;
  let user_current = req.user.dataValues
  if(user_current.role_id != 1){
    UserGamesHistory.findAll({include: [{model: UserGames, as : "user"}],where: { user_id:user_current.id}})
    .then((user_games_history) => {
        if (!user_games_history) {
            res.status(400).render("pages/user_games_history/add",{user_id:user_current.id,user_current})
        }else{
            res.status(200).render("pages/user_games_history/show",{user_games_history,moment,user_id:user_current.id,user_current})
        }
    })
  }else{
    UserGamesHistory.findAll({include: [{model: UserGames, as : "user"}],where: { user_id:id}})
    .then((user_games_history) => {
      let user_current = req.user.dataValues
        if (!user_games_history) {
            res.status(400).render("pages/user_games_history/add",{user_id:id,user_current})
        }else{
            res.status(200).render("pages/user_games_history/show",{user_games_history,moment,user_id:id,user_current})
        }
    })
    .catch((error) => {
      if (!error.status) error.status = 500;
      next(error);
    });
  }
};

exports.getById = (req, res, next) => {
  const id = req.params.id;
  let user_current = req.user.dataValues
  if(user_current.role_id != 1){
    UserGamesHistory.findOne({ where: { user_id: user_current.id } },{include: [{model: UserGames, as : "user"}]})
    .then((user_games_history) => {
        if (!user_games_history) {
            res.status(400).render("pages/user_games_history/add",{user_id:user_current.id,user_current})
        }else{
            res.status(200).render("pages/user_games_history/update",{user_games_history,moment,user_id:user_current.id,user_current})
        }
    })
  }else{
    UserGamesHistory.findByPk(id,{include: [{model: UserGames, as : "user"}]})
    .then((user_games_history) => {
        if (!user_games_history) {
            res.status(400).render("pages/user_games_history/add",{user_id:id,user_current})
        }else{
            res.status(200).render("pages/user_games_history/update",{user_games_history,moment,user_id:id,user_current})
        }
    })
    .catch((error) => {
      if (!error.status) error.status = 500;
      next(error);
    });
  }
};

exports.update = (req, res, next) => {
  let id = req.params.id
  let playtime = getIntervalTime(req.body?.session_end, req.body?.session_start)
  let userhistory_data = {
    user_id: req.body?.user_id,
    score: req.body?.score,
    session_start: req.body?.session_start,
    session_end: req.body?.session_end,
    playtime: playtime
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
      return failed(err)
    })
  }

  const checkBefore = (id, success, failed) => {
    UserGamesHistory.findOne({ where: { id: id } }).then((userhistory) => {
      return success(userhistory)
    }).catch((err) => {
      return failed(err)
    })
  }

  checkUserGames(userhistory_data.user_id, (data) => {
    if (!data) {
      return res.status(200).render('errors/error', { status: 200,message: 'User game id not found' })
    }

    checkBefore(id, (data) => {
      if (!data) {
        return res.status(200).render('errors/error', { status: 200,message: 'User game id not found' })
      }

      UserGamesHistory.update(userhistory_data, query).then((userhistory) => {
        return res.status(200).redirect(`/user-games/history/${userhistory_data.user_id}`);
      }).catch((error) => {
        if (!error.status) error.status = 500;
        next(error);
      });
    }, (err) => {
      //console.log(err)
      return res.status(400).render('errors/error', { status: 400,message: 'Failed' })
    })
  }, (err) => {
    //console.log(err)
    return res.status(400).render('errors/error', { status: 400,message: 'Failed' })
  })
};

exports.delete = (req, res, next) => {
  const { id } = req.params;
  UserGamesHistory.findByPk(id)
    .then((data) => {
      if (!data) {
        const error = new Error(`Could not find user games with id = ${id}`);
        error.status = 404;
        throw error;
      }
      UserGamesHistory.destroy({
        where: { id },
      });
      res.status(200).redirect(`/user-games/history/${userbiodata_data.user_id}`);
    })
    .catch((error) => {
      if (!error.status) error.status = 500;
      next(error);
    });
};

exports.del = (req, res, next) => {
    const { id } = req.params;
    UserGamesHistory.findByPk(id)
      .then((data) => {
        if (!data) {
          const error = new Error(`Could not find user games with id = ${id}`);
          error.status = 404;
          throw error;
        }
        const uid = data.user_id
        UserGamesHistory.destroy({
          where: { id },
        });
        res.status(200).redirect(`/user-games/history/${uid}`);
      })
      .catch((error) => {
        if (!error.status) error.status = 500;
        next(error);
      });
  };
