const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportLocalMongoose = require('passport-local-mongoose')
const session = require('express-session')
const methodOverride = require('method-override')

const commentRoutes = require('./routes/comments')
const campgroundRoutes = require('./routes/campgrounds')
const indexRoutes = require('./routes/index')

//=========================
// Main App
//=========================
const app = express()
const flash = require('connect-flash');

//=========================
// View engine and Encoding
//=========================
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))
app.use(flash())
app.set('view engine', 'ejs')


//=========================
// Database and Model Setup
//=========================
const User = require('./models/user')
seedDB = require('./seeds')
mongoose.connect('mongodb://localhost/yelp_camp')
mongoose.Promise = global.Promise;
//=========================
// Session and Passport Setup
//=========================
app.locals.moment = require('moment');
app.use(session({
    secret: 'Matt is the best',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
  res.locals.currentUser = req.user
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next()
})

//=========================
// Router Routes
//=========================
app.use(indexRoutes)
app.use(commentRoutes)
app.use(campgroundRoutes)

//seedDB()

//=========================
// Listener
//=========================
app.listen('3000', function(){
  console.log("YelpCamp Server started on port 3000")
})
