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

router.get('/google',checkNotAuthenticated,
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

router.get( '/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  })
);
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}
router.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Hello! ${req.user.username}<br> '<a href="/logout">Log Out</a>'`);
});

router.get("/logout", (req,res)=>{
    req.logOut();
    res.redirect('/login')
  });
module.exports = router