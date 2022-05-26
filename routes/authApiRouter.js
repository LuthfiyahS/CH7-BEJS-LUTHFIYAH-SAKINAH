const express = require('express')
const router = express.Router()
const ctl = require('./../controllers/api/authController')

router.post('/login', ctl.login)
router.post('/register', ctl.register)

module.exports = router