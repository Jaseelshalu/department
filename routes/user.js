var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/index', { user: req.session.user });
});

router.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  }
  else {
    res.render('user/login', { loginErr: req.session.loginErr, loginPage: true })
    req.session.loginErr = false
  }
})

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user
      req.session.user.loggedIn = true
      res.redirect('/')
    } else {
      req.session.loginErr = "Invalid email or password"
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.user = null
  res.redirect('/')
})

router.get('/signup', (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  }
  else {
    res.render('user/signup', { loginErr: req.session.loginErr, loginPage: true })
    req.session.loginErr = false
  }
})

router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user
      req.session.user.loggedIn = true
      res.redirect('/')
    } else {
      req.session.loginErr = "this email has already taken"
      res.redirect('/signup')
    }
  })
})

router.get('/form', (req, res) => {
  res.render('user/form', { user: req.session.user })
})

router.post('/form', (req, res) => {
  userHelpers.formTransfer(req.body).then((response) => {
    res.render('user/subject', { user: req.session.user })
  })
})

module.exports = router;
