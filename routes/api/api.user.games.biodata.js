const express = require("express");
const router = express.Router();
const controllerapi = require("../../controllers/api/usergamesbiodataController");

router.get("/", controllerapi.getUserGamesBiodata);

router.get("/:id", controllerapi.getUserGamesBiodataById);

router.post("/", controllerapi.addUserGamesBiodata);

router.put("/:id", controllerapi.updateUserGamesBiodata);

router.delete("/:id", controllerapi.deleteUserGamesBiodata);

module.exports = router;