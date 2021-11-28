const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const passport = require('./config/passport')
const helpers = require('./_helpers')

const app = express()
const port = process.env.PORT

// TEMPLATE ENGINE
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'hbs')

// BODY PARSER
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

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
  res.locals.loginUser = helpers.getUser(req)
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

// METHOD OVERRIDE
app.use(methodOverride('_method'))

// STATIC PROFILE
app.use('/upload', express.static(__dirname + '/upload'))

// ROUTES
require('./routes')(app)

// LISTENING
app.listen(port, () => {
  console.log(`The app is listening at http://localhost:${port}`)
})

// FOR TEST AUTOMATION
module.exports = app