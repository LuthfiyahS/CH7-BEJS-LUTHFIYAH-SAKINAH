const express = require("express");
const router = express.Router();
const controllerapi = require("../../controllers/api/usergameshistoryController");

router.get("/", controllerapi.getUserGamesHistory);

router.get("/:id", controllerapi.getUserGamesHistoryById);

router.post("/", controllerapi.addUserGamesHistory);

router.put("/:id", controllerapi.updateUserGamesHistory);

router.delete("/:id", controllerapi.deleteUserGamesHistory);

module.exports = router;
