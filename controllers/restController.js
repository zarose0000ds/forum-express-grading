const db = require('../models')
const helpers = require('../_helpers')

const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const Comment = db.Comment
const Favorite = db.Favorite

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

      // CLEAN UP RESTAURANT DATA
      const restaurants = result.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        categoryName: r.Category.name,
        isFavorited: req.user.FavoritedRestaurants.map(item => item.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(item => item.id).includes(r.id)
      }))
      Category.findAll({ raw: true, nest: true }).then(categories => {
        return res.render('restaurants', { restaurants, categories, categoryId, page, totalPage, prev, next })
      })
    })
  },
  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, { include: [
      Category,
      { model: User, as: 'FavoritedUsers' },
      { model: User, as: 'LikedUsers' },
      { model: Comment, include: [User] }
    ] }).then(restaurant => {
      const isFavorited = restaurant.FavoritedUsers.map(item => item.id).includes(req.user.id)
      const isLiked = restaurant.LikedUsers.map(item => item.id).includes(req.user.id)
      restaurant.update({
        viewCounts: restaurant.viewCounts + 1
      })
      return res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
    })
  },
  getFeeds: (req, res) => {
    return Promise.all([
      Restaurant.findAll({
        raw: true,
        nest: true,
        limit: 10,
        order: [['createdAt', 'desc'], ['id', 'desc']],
        include: [Category]
      }),
      Comment.findAll({
        raw: true,
        nest: true,
        limit: 10,
        order: [['createdAt', 'desc'], ['id', 'desc']],
        include: [User, Restaurant]
      })
    ]).then(([restaurants, comments]) => {
      res.render('feeds', { restaurants, comments })
    })
  },
  getDashBoard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      nest: true,
      include: [Category, Comment]
    }).then(restaurant => {
      res.render('dashboard', { restaurant: restaurant.toJSON() })
    })
  },
  getTopRestaurant: (req, res) => {
    return Restaurant.findAll({
      order: [['id', 'desc']],
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    }).then(restaurants => {
      restaurants = restaurants.map(r => ({
        ...r.dataValues,
        description: r.description.substring(0, 50),
        favoritedCount: r.FavoritedUsers.length,
        isFavorited: helpers.getUser(req).FavoritedRestaurants.map(item => item.id).includes(r.id),
        isLiked: helpers.getUser(req).LikedRestaurants.map(item => item.id).includes(r.id)
      }))
      restaurants = restaurants.sort((a, b) => b.favoritedCount - a.favoritedCount).slice(0, 10)
      restaurants = restaurants.map((r, index) => ({
        ...r,
        rank: index + 1
      }))
      return res.render('topRestaurant', { restaurants })
    })
  }
}
module.exports = restController