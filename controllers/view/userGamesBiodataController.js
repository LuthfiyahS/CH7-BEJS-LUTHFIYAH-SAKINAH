const { UserGames, UserGamesBiodata } = require("../../models");
const moment = require("moment");

exports.get =  (req, res, next) => {
  let user_current = req.user.dataValues
  if(user_current.role_id != 1){
    UserGamesBiodata.findOne({
      include: [{model: UserGames, as : "user"}],
      where: { user_id: user_current.id }
    })
      .then((user_games_biodata) => {
          res.status(200).render("pages/user_games_biodata",{user_games_biodata,moment,user_id:user_current.id,user_current})
      })
      .catch((error) => {
        res.status(500).render('errors/error', { status: 500,message: error.message })
      });
  }else{
    UserGamesBiodata.findAll({ include: [{model: UserGames, as : "user"}] })
    .then((user_games_biodata) => {
        res.status(200).render('pages/user_games_biodata/', { user_games_biodata,moment, user_current: user_current })
    })
    .catch((error) => {
      res.status(500).render('errors/error', { status: 500,message: error.message })
    });
  }
};

exports.add = (req, res, next) => {
  let user_current = req.user.dataValues
  if(user_current.role_id == 1){
    res.render("pages/user_games_biodata/add",{user_current})
  }
  res.status(201).redirect("/user-games-biodata");
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
        res.status(201).redirect(`/user-games/biodata/${user_id}`);
    }).catch((error) => {
      res.status(500).render('errors/error', { status: 500,message: error.message })
    })
  }, (error) => {
    //console.log(error)
    return res.status(400).render('errors/error', { status: 400,message: 'Failed' })
  })
};

exports.getUserGamesBiodataById = (req, res, next) => {
  const id = req.params.id;
  let user_current = req.user.dataValues
  if(user_current.role_id != 1){
    UserGamesBiodata.findOne({
      include: [{model: UserGames, as : "user"}],
      where: { user_id: user_current.id }
    }).then((user_games_biodata) => {
    if (!user_games_biodata) {
      res.status(302).render("pages/user_games_biodata/add",{user_id:user_current.id, user_current})
    }else{
      res.status(302).render("pages/user_games_biodata/show",{user_games_biodata,moment,user_current})
    }})
  }else{
    UserGamesBiodata.findOne({
      include: [{model: UserGames, as : "user"}],
      where: { user_id: req.params.id }
    })
      .then((user_games_biodata) => {
        
        if (!user_games_biodata) {
          res.status(302).render("pages/user_games_biodata/add",{user_id:id,user_current})
        }else{
          res.status(302).render("pages/user_games_biodata/show",{user_games_biodata,moment,user_current})
        }
      })
      .catch((error) => {
        res.status(500).render('errors/error', { status: 500,message: error.message })
      });
  }
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

exports.delete =  (req, res, next) => {
  let id = req.params.id;
  let userbiodata_data = {
    id: req.body?.id,
    user_id: req.body?.user_id,
  }
  UserGamesBiodata.findByPk(id)
    .then((data) => {
      if (!data) {
        res.status(404).render('errors/error', { status: 404,message: `Could not find user games biodata with id = ${id}` })
      }
      UserGamesBiodata.destroy({
        where: { id },
      });
      //console.log(id)
      res.status(200).redirect(`/user-games/biodata/${userbiodata_data.user_id}`);
    })
    .catch((error) => {
      res.status(500).render('errors/error', { status: 500,message: error.message })
    });
};

exports.del =  (req, res, next) => {
  let id = req.params.id;
  UserGamesBiodata.findByPk(id)
    .then((data) => {
      if (!data) {
        res.status(404).render('errors/error', { status: 404,message: `Could not find user games biodata with id = ${id}` })
      }
      UserGamesBiodata.destroy({
        where: { id },
      });
      //console.log(id)
      res.status(200).redirect(`/user-games-biodata`);
    })
    .catch((error) => {
      res.status(500).render('errors/error', { status: 500,message: error.message })
    });
};
