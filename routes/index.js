const adminController = require('../controllers/adminController')
const restController = require('../controllers/restController')

module.exports = (app) => {
  // ADMIN
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', adminController.getRestaurants)

  // USER
  app.get('/', (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', restController.getRestaurants)
}