const { UserGamesHistory,UserGames } = require("../../models");
const getIntervalTime = require('./../time')

exports.getUserGamesHistory = (req, res, next) => {
  UserGamesHistory.findAll({ include: [{model: UserGames, as : "user"}] })
    .then((user_games_history) => {
      res.status(200).json({
        success: "Success get data user games history",
        data: user_games_history,
      });
    })
    .catch((error) => {
      if (!error.status) error.status = 500;
      next(error);
    });
};

exports.addUserGamesHistory = (req, res, next) => {
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
      return res.status(404).json({
        'message': 'User game id not found',
      })
    }

    let playtime = getIntervalTime(session_end, session_start)

    UserGamesHistory.create({
      user_id: user_id,
      score: score,
      session_start: session_start,
      session_end: session_end,
      playtime: playtime
    }).then((userhistory) => {
      return res.status(201).json({
        'message': 'Success',
        'data': userhistory
      })
    }).catch((error) => {
      if (!error.status) error.status = 500;
      next(error);
    });
  }, (error) => {
    console.log(error)
    return res.status(400).json({
      'message': 'Failed'
    })
  })
};

exports.getUserGamesHistoryById = (req, res, next) => {
  const id = req.params.id;
  UserGamesHistory.findOne({include: [{model: UserGames, as : "user"}],where: { id:id}})
    .then((usergameshistory) => {
      if (!usergameshistory) {
        const error = new Error(`Could not find user games history with id = ${id}`);
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        success: `Success find user games history with id = ${id}`,
        data: usergameshistory,
      });
    })
    .catch((error) => {
      if (!error.status) error.status = 500;
      next(error);
    });
};

exports.updateUserGamesHistory = (req, res, next) => {
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
      return res.status(404).json({
        'message': 'User game id not found',
      })
    }

    checkBefore(id, (data) => {
      if (!data) {
        return res.status(404).json({
          'message': 'Data not found',
        })
      }

      UserGamesHistory.update(userhistory_data, query).then((userhistory) => {
        return res.status(200).json({
          'message': 'Success',
          'data': userhistory_data
        })
      }).catch((error) => {
        if (!error.status) error.status = 500;
        next(error);
      });
    }, (err) => {
      console.log(err)
      return res.status(400).json({
        'message': 'Failed'
      })
    })
  }, (err) => {
    console.log(err)
    return res.status(400).json({
      'message': 'Failed'
    })
  })
};

exports.deleteUserGamesHistory = (req, res, next) => {
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
      res.status(200).json({
        success: `Success delete user games history with id = ${id}`
      });
    })
    .catch((error) => {
      if (!error.status) error.status = 500;
      next(error);
    });
};
