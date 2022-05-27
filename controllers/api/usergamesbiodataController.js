const { UserGames, UserGamesBiodata } = require("../../models");
const jwt =require('jsonwebtoken')

function auth() {
  const token = req?.headers['authorization']
  const newStr = token.replace('Bearer ', '');
  const role  = jwt.decode(newStr);
  console.log(role)
    if (role.role_id != 1) {
        return res.status(401).json({
            'message': 'Unauthorized! You are not allowed to access this data'
        })
    }
}
exports.getUserGamesBiodata = (req, res, next) => {
  const token = req?.headers['authorization']
  const newStr = token.replace('Bearer ', '');
  const role  = jwt.decode(newStr);
  console.log(role)
    if (role.role_id != 1) {
        return res.status(401).json({
            'message': 'Unauthorized! You are not allowed to access this data'
        })
    }
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
  const token = req?.headers['authorization']
  const newStr = token.replace('Bearer ', '');
  const role  = jwt.decode(newStr);
  console.log(role)
    if (role.role_id != 1) {
      if(user_id != role.id)
        return res.status(401).json({
            'message': 'Unauthorized! You are not allowed to access this data'
      })
    }
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
    const checkUserGamesBio = (user_id, success, failed) => {
      UserGamesBiodata.findOne({ where: { user_id: user_id } }).then((UserGamesBiodata) => {
        return success(UserGamesBiodata)
      }).catch((err) => {
        return failed(err)
      })
    }
  
    checkUserGamesBio(user_id, (data) => {
      if (data) {
        return res.status(404).json({
          'message': 'User game for this user is available please check',
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
})
};

exports.getUserGamesBiodataById = (req, res, next) => {
  const id = req.params.id;
  const token = req?.headers['authorization']
  const newStr = token.replace('Bearer ', '');
  const role  = jwt.decode(newStr);
  UserGamesBiodata.findOne({
    include: [{model: UserGames, as : "user"}],
    where: { id: req.params.id }
  })
    .then((user_games_biodata) => {
      console.log(role)
      if (role.role_id != 1) {
        if(user_games_biodata.user_id == role.id){
          res.status(200).json({
            success: `Success find user games biodata with id = ${id}`,
            data: user_games_biodata,
          });
        }
        return res.status(401).json({
          'message': 'Unauthorized! You are not allowed to access this data'
        })
      }
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
  const token = req?.headers['authorization']
  const newStr = token.replace('Bearer ', '');
  const role  = jwt.decode(newStr);
  
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
  console.log(role)
    if (role.role_id != 1) {
      UserGamesBiodata.findOne({ where: { id: id } }).then((userbiodata,next) => {
        if(userbiodata.user_id != role.id){
          return res.status(401).json({
            'message': 'Unauthorized! You are not allowed to access this data'
          })
        }else{
          UserGamesBiodata.update(userbiodata_data, query).then((userbiodata_data) => {
            return res.status(200).json({
              'message': 'Success',
              'data': userbiodata_data
            })
          }).catch((error) => {
            if (!error.status) error.status = 500;
            next(error);
          });
        }
      })
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
