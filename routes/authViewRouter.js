const express = require('express')
const res = require('express/lib/response')
const router = express.Router()
const ctl = require('./../controllers/view/authController')
const passport = require('passport')

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/dashboard');
    }
    next();
  }

router.get('/login', ctl.login)
router.get('/register', ctl.register)
router.post('/registers', ctl.registerproses)
router.post('/logins',checkNotAuthenticated,passport.authenticate('local',{
    successRedirect: 'dashboard',
    failureRedirect:'login',
    failureFlash:true
}) )
router.get("/logout", (req,res)=>{
    req.logOut();
    res.redirect('/login')
  });
module.exports = router