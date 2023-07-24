var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers');

/* Session */

const verifyLogin = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('user/index', { user: req.session.user, loginErr: req.session.loginErr });
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

router.get('/form', verifyLogin, async (req, res) => {
  let data = await userHelpers.unlockedItems()
  let unlock = {}
  for (i = 1; i <= data.length; i++) {
    if (data['sum' + i] == "subject1") unlock.s1 = true
    else if (data['sum' + i] == "subject1") unlock.s2 = true
    else if (data['sum' + i] == "subject1") unlock.s3 = true
    else if (data['sum' + i] == "subject1") unlock.s4 = true
    else if (data['sum' + i] == "subject1") unlock.s5 = true
    else if (data['sum' + i] == "subject1") unlock.s6 = true
    else if (data['sum' + i] == "subject1") unlock.s7 = true
    else if (data['sum' + i] == "subject1") unlock.s8 = true
    else if (data['sum' + i] == "subject1") unlock.s9 = true
    else if (data['sum' + i] == "subject1") unlock.s10 = true
    else if (data['sum' + i] == "subject1") unlock.s11 = true
    else if (data['sum' + i] == "subject1") unlock.s12 = true
    else if (data['sum' + i] == "subject1") unlock.s13 = true
    else if (data['sum' + i] == "subject1") unlock.s14 = true
    else if (data['sum' + i] == "subject1") unlock.s15 = true
    else if (data['sum' + i] == "subject1") unlock.s16 = true
    else if (data['sum' + i] == "subject1") unlock.s17 = true
    else if (data['sum' + i] == "subject1") unlock.s18 = true
    else if (data['sum' + i] == "subject1") unlock.s19 = true
    else if (data['sum' + i] == "subject1") unlock.s20 = true
    else if (data['sum' + i] == "subject1") unlock.s21 = true
    else if (data['sum' + i] == "subject1") unlock.s22 = true
    else if (data['sum' + i] == "subject1") unlock.s23 = true
    else if (data['sum' + i] == "subject1") unlock.s24 = true
    else if (data['sum' + i] == "subject1") unlock.s25 = true
    else if (data['sum' + i] == "subject1") unlock.s26 = true
    else if (data['sum' + i] == "subject1") unlock.s27 = true
    else if (data['sum' + i] == "subject1") unlock.s28 = true
    else if (data['sum' + i] == "subject1") unlock.s29 = true
    else if (data['sum' + i] == "subject1") unlock.s30 = true
  }
  res.render('user/form', { user: req.session.user, loginErr: req.session.loginErr, unlock })
})

router.post('/form', (req, res) => {
  userHelpers.formTransfer(req.body).then((response) => {
    if (response.result) {
      res.render('/user/subject', { user: req.session.user, title: req.body.formRadio })
    } else if (response.exist) {
      req.session.loginErr = response.exist
      res.redirect('/')
      req.session.err = false
    } else if (response.sub) {
      req.session.loginErr = response.sub
      res.redirect('/user/form')
      req.session.loginErr = false
    } else {
      res.redirect('/')
    }
  })
})

module.exports = router;
