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
    let didForm = await userHelpers.checkingForm(req.session.user._id)
    // let surahSelection = await userHelpers.checkingSurah(req.session.user.Name) // new
    if (didForm) {
    // if (didForm && surahSelection) { // new
      let subject = await userHelpers.findSubject(req.session.user._id)
      let surah = await userHelpers.findSurah(req.session.user._id)
      let tlink = await userHelpers.findTlink(subject.Program)
      let userProfile = await userHelpers.getUserProfile(req.session.user._id)
      res.render('user/index', { user: req.session.user, loginErr: req.session.loginErr, title: req.body.formRadio, subject, surah, profile: true, userProfile, tlink });
      req.session.loginErr = false
    }
    else res.redirect('/form')
    // else res.redirect('/surah') // new
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
      req.session.user.loggedIn = true
      res.redirect('/')
    } else {
      req.session.loginErr = "this email has already taken"
      res.redirect('/signup')
    }
  })
})

router.get('/form', verifyLogin, async (req, res) => {
  let didForm = await userHelpers.checkingForm(req.session.user._id)
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
  if (req.session.user) {
    let candidates = await userHelpers.candidates()
    res.render('user/candidates', { user: req.session.user, candidates })
  } else {
    let candidates = await userHelpers.candidates()
    res.render('user/candidates', { candidates, judge: true })
  }
})

router.post('/form', (req, res) => {
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

router.get('/surah', verifyLogin, async (req, res) => {
  let subject = {}
  let sub = await userHelpers.findSubject(req.session.user._id); sub = sub.Program
  if (sub == 'ورش عن نافع') subject.s1 = 'true'
  if (sub == 'قالون عن نافع') subject.s2 = 'true'
  if (sub == 'البزي عن ابن كثير') subject.s3 = 'true'
  if (sub == 'قنبل عن ابن كثير') subject.s4 = 'true'
  if (sub == 'الدوري عن ابي عمرو') subject.s5 = 'true'
  if (sub == 'السوسي عن ابي عمرو') subject.s6 = 'true'
  if (sub == 'هشام عن ابن عامر') subject.s7 = 'true'
  if (sub == 'ابن ذكوان عن ابن عامر') subject.s8 = 'true'
  if (sub == 'شعبة عن عاصم') subject.s9 = 'true'
  if (sub == 'خلف عن حمزة') subject.s10 = 'true'
  if (sub == 'خلاد عن حمزة') subject.s11 = 'true'
  if (sub == 'ابو الحارث عن الكسائي') subject.s12 = 'true'
  if (sub == 'الدوري عن الكسائي') subject.s13 = 'true'

  let didSurah = await userHelpers.checkingSurah(req.session.user._id)
  if (didSurah) res.redirect('/')
  let data = await userHelpers.unlockedSurahs()
  let unlock = {}
  for (i = 1; i <= 30; i++) {
    if (data['sum' + i] == "surahRadio1") unlock.s1 = 'true'
    else if (data['sum' + i] == "surahRadio2") unlock.s2 = 'true'
    else if (data['sum' + i] == "surahRadio3") unlock.s3 = 'true'
    else if (data['sum' + i] == "surahRadio4") unlock.s4 = 'true'
    else if (data['sum' + i] == "surahRadio5") unlock.s5 = 'true'
    else if (data['sum' + i] == "surahRadio6") unlock.s6 = 'true'
    else if (data['sum' + i] == "surahRadio7") unlock.s7 = 'true'
    else if (data['sum' + i] == "surahRadio8") unlock.s8 = 'true'
    else if (data['sum' + i] == "surahRadio9") unlock.s9 = 'true'
    else if (data['sum' + i] == "surahRadio10") unlock.s10 = 'true'
    else if (data['sum' + i] == "surahRadio11") unlock.s11 = 'true'
    else if (data['sum' + i] == "surahRadio12") unlock.s12 = 'true'
    else if (data['sum' + i] == "surahRadio13") unlock.s13 = 'true'
    else if (data['sum' + i] == "surahRadio14") unlock.s14 = 'true'
    else if (data['sum' + i] == "surahRadio15") unlock.s15 = 'true'
    else if (data['sum' + i] == "surahRadio16") unlock.s16 = 'true'
    else if (data['sum' + i] == "surahRadio17") unlock.s17 = 'true'
    else if (data['sum' + i] == "surahRadio18") unlock.s18 = 'true'
    else if (data['sum' + i] == "surahRadio19") unlock.s19 = 'true'
    else if (data['sum' + i] == "surahRadio20") unlock.s20 = 'true'
    else if (data['sum' + i] == "surahRadio21") unlock.s21 = 'true'
    else if (data['sum' + i] == "surahRadio22") unlock.s22 = 'true'
    else if (data['sum' + i] == "surahRadio23") unlock.s23 = 'true'
    else if (data['sum' + i] == "surahRadio24") unlock.s24 = 'true'
    else if (data['sum' + i] == "surahRadio25") unlock.s25 = 'true'
    else if (data['sum' + i] == "surahRadio26") unlock.s26 = 'true'
    else if (data['sum' + i] == "surahRadio27") unlock.s27 = 'true'
    else if (data['sum' + i] == "surahRadio28") unlock.s28 = 'true'
    else if (data['sum' + i] == "surahRadio29") unlock.s29 = 'true'
    else if (data['sum' + i] == "surahRadio30") unlock.s30 = 'true'
  }
  console.log(subject);
  res.render('user/surah', { user: req.session.user, loginErr: req.session.loginErr, subject, unlock })
})

router.post('/surah', (req, res) => {
  userHelpers.surahTransfer(req.body).then(async (response) => {
    if (response.result) {
      res.redirect('/')
    } else if (response.exist) {
      req.session.loginErr = response.exist
      res.redirect('/')
    } else if (response.sub) {
      req.session.loginErr = response.sub
      res.redirect('/surah')
    }
  })
})

router.get('/api/users', async (req, res) => {
  let users = await userHelpers.getUsersApi()
})

module.exports = router;
