const router = require('express').Router()

const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryController')

// ADMIN
router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)

router.get('/admin/categories', categoryController.getCategories)
router.get('/admin/categories/:id', categoryController.getCategories)

module.exports = router