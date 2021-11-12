const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const passport = require('./config/passport')

const app = express()
const port = process.env.PORT

// TEMPLATE ENGINE
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// BODY PARSER
app.use(express.urlencoded({ extended: true }))

//SESSION
app.use(session({
  secret: 'RestaurantForumSecret',
  resave: false,
  saveUninitialized: false
}))

// PASSPORT
app.use(passport.initialize())
app.use(passport.session())

// FLASH MESSAGE
app.use(flash())

// LOCAL PARAMS
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

// METHOD OVERRIDE
app.use(methodOverride('_method'))

// STATIC PROFILE
app.use('/upload', express.static(__dirname + '/upload'))

// ROUTES
require('./routes')(app, passport)

// LISTENING
app.listen(port, () => {
  console.log(`The app is listening at http://localhost:${port}`)
})

// FOR TEST AUTOMATION
module.exports = app