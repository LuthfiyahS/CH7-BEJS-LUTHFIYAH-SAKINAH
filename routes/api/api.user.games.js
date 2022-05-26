const express = require("express");
const router = express.Router();
const controllerapi = require("../../controllers/api/usergamesController");

router.get("/", controllerapi.getUserGames);

router.get("/:id", controllerapi.getUserGamesById);

router.post("/", controllerapi.addUserGames);

router.post("/insert", controllerapi.createUserGames);

router.put("/:id", controllerapi.updateUserGames);

router.delete("/:id", controllerapi.deleteUserGames);

module.exports = router;
