var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers');
const { log } = require('logrocket');

/* Session */

const verifyLogin = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', async function (req, res, next) {
  if (req.session.user) {
    let didForm = await userHelpers.checkingForm(req.session.name)
    if (didForm) {
      userHelpers.findSubject(req.session.name).then(async (subject) => {
        let userProfile = await userHelpers.getUserProfile(req.session.name)
        res.render('user/index', { user: req.session.user, loginErr: req.session.loginErr, title: req.body.formRadio, subject, profile: true, userProfile });
        req.session.loginErr = false
      })
    }
    else res.redirect('/form')
  } else {
    res.redirect('/login')
  }
});

router.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  }
  else {
    res.render('user/login', { loginErr: req.session.loginErr, profile: true })
    req.session.loginErr = false
  }
})

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then(async (response) => {
    if (response.status) {
      req.session.user = response.user
      req.session.name = response.user.Name
      req.session.user.loggedIn = true
      res.redirect('/')
    } else {
      req.session.loginErr = "Invalid email or password"
      res.redirect('/login')
    }
  })
})

router.get('/logout', verifyLogin, (req, res) => {
  req.session.user = null
  res.redirect('/')
})

router.get('/signup', (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  }
  else {
    res.render('user/signup', { loginErr: req.session.loginErr, profile: true })
    req.session.loginErr = false
  }
})

router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user
      req.session.name = response.user.Name
      req.session.user.loggedIn = true
      res.redirect('/')
    } else {
      req.session.loginErr = "this email has already taken"
      res.redirect('/signup')
    }
  })
})

router.get('/form', verifyLogin, async (req, res) => {
  let didForm = await userHelpers.checkingForm(req.session.name)
    if (didForm) res.redirect('/')
  let data = await userHelpers.unlockedItems()
  let unlock = {}
  for (i = 1; i <= 30; i++) {
    if (data['sum' + i] == "formRadio1") unlock.s1 = 'true'
    else if (data['sum' + i] == "formRadio2") unlock.s2 = 'true'
    else if (data['sum' + i] == "formRadio3") unlock.s3 = 'true'
    else if (data['sum' + i] == "formRadio4") unlock.s4 = 'true'
    else if (data['sum' + i] == "formRadio5") unlock.s5 = 'true'
    else if (data['sum' + i] == "formRadio6") unlock.s6 = 'true'
    else if (data['sum' + i] == "formRadio7") unlock.s7 = 'true'
    else if (data['sum' + i] == "formRadio8") unlock.s8 = 'true'
    else if (data['sum' + i] == "formRadio9") unlock.s9 = 'true'
    else if (data['sum' + i] == "formRadio10") unlock.s10 = 'true'
    else if (data['sum' + i] == "formRadio11") unlock.s11 = 'true'
    else if (data['sum' + i] == "formRadio12") unlock.s12 = 'true'
    else if (data['sum' + i] == "formRadio13") unlock.s13 = 'true'
    else if (data['sum' + i] == "formRadio14") unlock.s14 = 'true'
    else if (data['sum' + i] == "formRadio15") unlock.s15 = 'true'
    else if (data['sum' + i] == "formRadio16") unlock.s16 = 'true'
    else if (data['sum' + i] == "formRadio17") unlock.s17 = 'true'
    else if (data['sum' + i] == "formRadio18") unlock.s18 = 'true'
    else if (data['sum' + i] == "formRadio19") unlock.s19 = 'true'
    else if (data['sum' + i] == "formRadio20") unlock.s20 = 'true'
    else if (data['sum' + i] == "formRadio21") unlock.s21 = 'true'
    else if (data['sum' + i] == "formRadio22") unlock.s22 = 'true'
    else if (data['sum' + i] == "formRadio23") unlock.s23 = 'true'
    else if (data['sum' + i] == "formRadio24") unlock.s24 = 'true'
    else if (data['sum' + i] == "formRadio25") unlock.s25 = 'true'
    else if (data['sum' + i] == "formRadio26") unlock.s26 = 'true'
    else if (data['sum' + i] == "formRadio27") unlock.s27 = 'true'
    else if (data['sum' + i] == "formRadio28") unlock.s28 = 'true'
    else if (data['sum' + i] == "formRadio29") unlock.s29 = 'true'
    else if (data['sum' + i] == "formRadio30") unlock.s30 = 'true'
  }
  res.render('user/form', { user: req.session.user, loginErr: req.session.loginErr, unlock })
  req.session.loginErr = false
})

router.get('/candidates', async (req, res) => {
  if(req.session.name){
      let candidates = await userHelpers.candidates()
      res.render('user/candidates', { user: req.session.user, candidates })
  }else{
    let candidates = await userHelpers.candidates()
    res.render('user/candidates', { candidates })
  }
})

router.post('/form', (req, res) => {
  console.log(req.body);
  userHelpers.formTransfer(req.body).then(async (response) => {
    if (response.result) {
      res.redirect('/')
    } else if (response.exist) {
      req.session.loginErr = response.exist
      res.redirect('/')
    } else if (response.sub) {
      req.session.loginErr = response.sub
      res.redirect('/form')
    }
  })
})

module.exports = router;
