const fs = require('fs')
const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const User = db.User
const Category = db.Category
const Restaurant = db.Restaurant

const adminService = {
  getRestaurants: (req, res, cb) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] }).then(restaurants => {
      cb({ restaurants })
    })
  },
  getRestaurant: (req, res, cb) => {
    return Restaurant.findByPk(req.params.id, { nest: true, include: [Category] }).then(restaurant => {
      cb({ restaurant: restaurant.toJSON() })
    })
  }
}

module.exports = adminService