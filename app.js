const express = require('express')
const exphbs = require('express-handlebars')

const app = express()
const port = 3000

// TEMPLATE ENGINE
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// ROUTES
require('./routes')(app)

// LISTENING
app.listen(port, () => {
  console.log(`The app is listening at http://localhost:${port}`)
})

// FOR TEST AUTOMATION
module.exports = app