const router = require("express").Router();
const apiusergames = require("./api.user.games")
const apiusergamesbiodata = require("./api.user.games.biodata")
const apiusergameshistory = require("./api.user.games.history")
const homeapi = require("./../../controllers/api/api.home");
const Middleware = require('../../middleware')
const ctl = require('./../../controllers/api/authController')

router.post('/login', ctl.login)
router.post('/register', ctl.register)

//router.get("/", homeapi.home);
//router.use("/user-games", apiusergames)
router.use("/user-games",Middleware.verifyJwt, apiusergames)
router.use("/user-games-biodata",Middleware.verifyJwt,apiusergamesbiodata)
router.use("/user-games-history",Middleware.verifyJwt,apiusergameshistory)

module.exports = router