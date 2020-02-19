var reseedDatabase = false

var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  seedDb = require('./seed'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  User = require('./models/user'),
  methodOverride = require('method-override'),
  flash =  require('connect-flash')

var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    authRoutes = require('./routes/index')
 

if (reseedDatabase){
  seedDb()
} 

mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp_v6", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use(bodyParser.urlencoded({
  extended: true
}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))

// PASSPORT CONFIG
app.use(require('express-session')({
  secret: "Anything",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(verifyAuthentication)

app.use(function(req, res, next) {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

//ROUTES ADDED
app.use('/campgrounds/:id/comments', (req, res, next) => {
  req.id = req.params.id
  next()
}, commentRoutes)
app.use("/campgrounds" ,campgroundRoutes)
app.use("/",authRoutes)

//GET CURRENT USER
function verifyAuthentication(req, res, next) {
  res.locals.currentUser = req.user
  next()
}

app.listen(8000, process.env.IP, function () {
  console.log("App launched")
})