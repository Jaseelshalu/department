var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/index');
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

router.get('/cart-login', (req, res) => {
  res.render('user/login', { loginErr: req.session.loginErr, cartLogin: true, loginPage: true })
  req.session.loginErr = false
  req.session.cart = true
})

router.post('/cart-login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user
      req.session.user.loggedIn = true
      res.redirect('/cart')
    } else {
      req.session.loginErr = "Invalid email or password"
      res.redirect('/cart-login')
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.user = null
  res.redirect('/')
})

module.exports = router;
