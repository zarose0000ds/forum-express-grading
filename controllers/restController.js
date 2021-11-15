const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const PAGE_LIMIT = 10

const restController = {
  getRestaurants: (req, res) => {
    const where = {}
    let categoryId = ''
    let offset = 0

    // FOR CATEGORY FILTER
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      where.categoryId = categoryId
    }

    // FOR PAGINATOR
    if (req.query.page) {
      offset = (req.query.page - 1) * PAGE_LIMIT
    }

    Restaurant.findAndCountAll({ raw: true, nest: true, include: Category, where, offset, limit: PAGE_LIMIT }).then(result => {
      // PAGINATOR DATA
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / PAGE_LIMIT)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      console.log(page, pages, totalPage, prev, next)

      // CLEAN UP RESTAURANT DATA
      const restaurants = result.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        categoryName: r.Category.name
      }))
      Category.findAll({ raw: true, nest: true }).then(categories => {
        return res.render('restaurants', { restaurants, categories, categoryId, page, totalPage, prev, next })
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