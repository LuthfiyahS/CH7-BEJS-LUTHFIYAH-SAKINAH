const { UserGames, UserGamesBiodata } = require("../../models");

exports.getUserGamesBiodata = (req, res, next) => {
  UserGamesBiodata.findAll({ include: [{model: UserGames, as : "user"}] })
    .then((user_games_biodata) => {
      res.status(200).json({
        success: "Success get data user games biodata",
        data: user_games_biodata,
      });
    })
    .catch((error) => {
      if (!error.status) error.status = 500;
      next(error);
    });
};

exports.addUserGamesBiodata = (req, res, next) => {
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
      return res.status(404).json({
        'message': 'User game id not found',
      })
    }

    UserGamesBiodata.create({
      user_id: user_id,
      fullname: fullname,
      gender: gender,
      date_of_birth: date_of_birth,
      place_of_birth: place_of_birth,
      address: address,
    }).then((userbiodata) => {
      return res.status(201).json({
        'message': 'Success',
        'data': userbiodata
      })
    }).catch((error) => {
      return res.status(500).json({
        'message': error.message,
      })
    })
  }, (error) => {
    console.log(error)
    return res.status(400).json({
      'message': 'Failed'
    })
  })
};

exports.getUserGamesBiodataById = (req, res, next) => {
  const id = req.params.id;
  UserGamesBiodata.findOne({
    include: [{model: UserGames, as : "user"}],
    where: { id: req.params.id }
  })
    .then((user_games_biodata) => {
      if (!user_games_biodata) {
        const error = new Error(`Could not find user games biodata with id = ${id}`);
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        success: `Success find user games biodata with id = ${id}`,
        data: user_games_biodata,
      });
    })
    .catch((error) => {
      if (!error.status) error.status = 500;
      next(error);
    });
};

exports.updateUserGamesBiodata = (req, res, next) => {
  let id = req.params.id
  let userbiodata_data = {
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
      return failed(err)
    })
  }

  const checkBefore = (id, success, failed) => {
    UserGamesBiodata.findOne({ where: { id: id } }).then((userbiodata) => {
      return success(userbiodata)
    }).catch((err) => {
      return failed(err)
    })
  }

  checkUserGames(userbiodata_data.user_id, (data) => {
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

      UserGamesBiodata.update(userbiodata_data, query).then((userbiodata_data) => {
        return res.status(200).json({
          'message': 'Success',
          'data': userbiodata_data
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

exports.deleteUserGamesBiodata = (req, res, next) => {
  const { id } = req.params;
  UserGamesBiodata.findByPk(id)
    .then((data) => {
      if (!data) {
        const error = new Error(`Could not find user games biodata with id = ${id}`);
        error.status = 404;
        throw error;
      }
      UserGamesBiodata.destroy({
        where: { id },
      });
      res.status(200).json({
        success: `Success delete user games biodata with id = ${id}`
      });
    })
    .catch((error) => {
      if (!error.status) error.status = 500;
      next(error);
    });
};
