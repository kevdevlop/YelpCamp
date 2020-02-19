var express = require('express')
var router = express.Router()
var User = require('../models/user')
var passport = require('passport')

router.get('/', function (req, res) {
    res.render("landing")
})

//AUTH ROUTES
router.get('/register', function (req, res) {
    res.render('register')
})

router.post('/register', function (req, res) {
    var newUser = new User({
        username: req.body.username
    })
    User.register(newUser, req.body.password, function (err, user) {

        if (err) {
            res.flash('error', err)
            return res.render('register', {error: err.message})
        }

        passport.authenticate('local')(req, res, function () {
            res.flash('success', "Bienvenido " + res.user.username)
            res.redirect("/campgrounds")
        })
    })
})

router.get('/login', function (req, res) {
    res.render('login')
})

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Bienvenido!'
    }), function(req, res){
});


router.get('/logout', function (req, res) {
    req.logout()
    req.flash('success', "Nos vemos pronto :D")
    res.redirect("/campgrounds")
})


module.exports = router