var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var fs = require('fs')

/* Session */

const verifyLogin = (req, res, next) => {
    if (req.session.admin) {
        next()
    } else {
        res.redirect('/admin/login')
    }
}

/* GET users listing. */

router.get('/', function (req, res, next) {
    productHelpers.getAllUsers().then((users) => {
        for (i = 0; i < users.length; i++) {
            users[i].Number = i + 1
        }
        res.render('admin/view-users', { admin: true, users, adminData: req.session.admin });
    })
})

router.get('/login', (req, res) => {
    if (req.session.admin) {
        res.redirect('/admin')
    }
    else {
        res.render('admin/login', { admin: true, loginErr: req.session.loginErr, loginPage: true })
        req.session.loginErr = false
    }
})

router.post('/login', (req, res) => {
    productHelpers.doLogin(req.body).then((response) => {
        if (response.status) {
            req.session.admin = response.admin
            req.session.admin.loggedIn = true
            res.redirect('/admin')
        } else {
            req.session.loginErr = "Invalid email or password"
            res.redirect('/admin/login')
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.admin = null
    res.redirect('/admin')
})

router.get('/signup', (req, res) => {
    res.render('admin/signup', { loginErr: req.session.loginErr, loginPage: true })
})

router.post('/signup', (req, res) => {
    productHelpers.doSignup(req.body).then((response) => {
        if (response.status) {
            req.session.admin = response.admin
            req.session.admin.loggedIn = true
            res.redirect('/admin')
        } else {
            req.session.loginErr = response.loginErr
            res.redirect('/admin/signup')
        }
    })
})

router.get('/add-user', verifyLogin, (req, res) => {
    res.render('admin/add-user', { admin: true, adminData: req.session.admin })
  })
  
  router.post('/add-user', (req, res) => {
    let image = req.files.Image
    productHelpers.adduser(req.body).then((id) => {
      image.mv(`./public/images/user-images/${id}.jpg`, (err) => {
        if (!err) res.redirect('/admin')
        else console.log(err);
      })
    })
  })
  
  router.get('/edit-user/', verifyLogin, (req, res) => {
    let proId = req.query.id
    productHelpers.getUserDetails(proId).then((user) => {
      res.render('admin/edit-user', { admin: true, user, adminData: req.session.admin })
    })
  })
  
  router.post('/edit-user/', (req, res) => {
    let proId = req.body.Id
    let newuser = req.body
    productHelpers.edituser(proId, newuser).then(() => {
      res.redirect('/admin')
      if (req.files) {
        let image = req.files.Image
        image.mv(`./public/images/user-images/${proId}.jpg`)
      }
    })
  })
  
  router.get('/delete-user/:id', verifyLogin, (req, res) => {
    let proId = req.params.id
    productHelpers.deleteuser(proId).then(() => {
      res.redirect('/admin')
      let imagePath = `./public/images/user-images/${proId}.jpg`
      fs.unlink(imagePath, (err) => {
        if (err) console.log(err)
      })
    })
  })

module.exports = router;
