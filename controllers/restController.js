const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    const where = {}
    let categoryId = ''

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      where.CategoryId = categoryId
    }

    Restaurant.findAll({ raw: true, nest: true, include: Category, where }).then(restaurants => {
      restaurants = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        categoryName: r.Category.name
      }))
      Category.findAll({ raw: true, nest: true }).then(categories => {
        return res.render('restaurants', { restaurants, categories, categoryId })
      })
    })
  },
  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, { include: Category }).then(restaurant => {
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    })
  }
}
module.exports = restController