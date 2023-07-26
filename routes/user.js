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
router.get('/', async function (req, res, next) {
  let name = req.session.name
  console.log('dff'+name);
  let subject = await userHelpers.findSubject(name)
  if (subject) res.render('user/index', { user: req.session.user, loginErr: req.session.loginErr, title: req.body.formRadio, subject });
  else res.render('user/index', { user: req.session.user, loginErr: req.session.loginErr, title: req.body.formRadio });

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
      req.session.name =response.user.Name
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

// router.get('/signup', (req, res) => {
//   if (req.session.user) {
//     res.redirect('/')
//   }
//   else {
//     res.render('user/signup', { loginErr: req.session.loginErr, loginPage: true })
//     req.session.loginErr = false
//   }
// })

// router.post('/signup', (req, res) => {
//   userHelpers.doSignup(req.body).then((response) => {
//     if (response.status) {
//       req.session.user = response.user
//       req.session.user.loggedIn = true
//       res.redirect('/')
//     } else {
//       req.session.loginErr = "this email has already taken"
//       res.redirect('/signup')
//     }
//   })
// })

router.get('/form', verifyLogin, async (req, res) => {
  let data = await userHelpers.unlockedItems()
  let unlock = {}
  for (i = 1; i <= data.count; i++) {
    if (data['sum' + i] == "subject1") unlock.s1 = 'true'
    else if (data['sum' + i] == "subject2") unlock.s2 = 'true'
    else if (data['sum' + i] == "subject3") unlock.s3 = 'true'
    else if (data['sum' + i] == "subject4") unlock.s4 = 'true'
    else if (data['sum' + i] == "subject5") unlock.s5 = 'true'
    else if (data['sum' + i] == "subject6") unlock.s6 = 'true'
    else if (data['sum' + i] == "subject7") unlock.s7 = 'true'
    else if (data['sum' + i] == "subject8") unlock.s8 = 'true'
    else if (data['sum' + i] == "subject9") unlock.s9 = 'true'
    else if (data['sum' + i] == "subject10") unlock.s10 = 'true'
    else if (data['sum' + i] == "subject11") unlock.s11 = 'true'
    else if (data['sum' + i] == "subject12") unlock.s12 = 'true'
    else if (data['sum' + i] == "subject13") unlock.s13 = 'true'
    else if (data['sum' + i] == "subject14") unlock.s14 = 'true'
    else if (data['sum' + i] == "subject15") unlock.s15 = 'true'
    else if (data['sum' + i] == "subject16") unlock.s16 = 'true'
    else if (data['sum' + i] == "subject17") unlock.s17 = 'true'
    else if (data['sum' + i] == "subject18") unlock.s18 = 'true'
    else if (data['sum' + i] == "subject19") unlock.s19 = 'true'
    else if (data['sum' + i] == "subject20") unlock.s20 = 'true'
    else if (data['sum' + i] == "subject21") unlock.s21 = 'true'
    else if (data['sum' + i] == "subject22") unlock.s22 = 'true'
    else if (data['sum' + i] == "subject23") unlock.s23 = 'true'
    else if (data['sum' + i] == "subject24") unlock.s24 = 'true'
    else if (data['sum' + i] == "subject25") unlock.s25 = 'true'
    else if (data['sum' + i] == "subject26") unlock.s26 = 'true'
    else if (data['sum' + i] == "subject27") unlock.s27 = 'true'
    else if (data['sum' + i] == "subject28") unlock.s28 = 'true'
    else if (data['sum' + i] == "subject29") unlock.s29 = 'true'
    else if (data['sum' + i] == "subject30") unlock.s30 = 'true'
  }
  res.render('user/form', { user: req.session.user, loginErr: req.session.loginErr, unlock })
})

router.post('/form', (req, res) => {
  userHelpers.formTransfer(req.body).then(async (response) => {
    if (response.result) {
      let sub = req.body.Program
        if (sub == "subject5" || "subject10") sub = "قالون عن نافع"
        else if (sub == "subject5" || "subject10") sub = "ورش عن نافع"
        else if (sub == "subject18" || "subject24") sub = "البزي عن ابن كثير"
        else if (sub == "subject11" || "subject16" || "subject13") sub = "قنبل عن ابن كثير"
        else if (sub == "subject3" || "subject20" || "subject26") sub = "الدوري عن أبي عمرو"
        else if (sub == "subject23" || "subject27") sub = "السوسي عن أبي عمرو"
        else if (sub == "subject9" || "subject12" || "subject19") sub = "هشام عن ابن عامر"
        else if (sub == "subject14" || "subject15") sub = "ابن ذكوان عن ابن عامر"
        else if (sub == "subject22" || "subject30") sub = "شعبة عن عاصم"
        else if (sub == "subject8" || "subject29") sub = "خلف عن حمزة"
        else if (sub == "subject2" || "subject6" || "subject25") sub = "خلاد عن حمزة"
        else if (sub == "subject7" || "subject21") sub = "ابو الحارث عن الكسائي"
        else if (sub == "subject17" || "subject28") sub = "الدوري عن الكسائي"
        let obj = {
          Name: req.body.Name,
          Program: sub
        }
        userHelpers.subTransfer(obj).then(()=> {
          res.redirect('/');
        })
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

router.get('/subject', (req, res) => {
  res.render('user/subject', { user: req.session.user, title: req.body.formRadio, sub });
})

module.exports = router;
