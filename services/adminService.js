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
  },
  deleteRestaurant: (req, res, cb) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => restaurant.destroy()).then(() => {
      cb({ status: 'success', message: '' })
    })
  },
  postRestaurant: (req, res, cb) => {
    if (!req.body.name) {
      return cb({ status: 'error', message: "name doesn't exist" })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (e, img) => {
        if (e) console.log(e)
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hour: req.body.opening_hour,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        }).then(restaurant => {
          cb({ status: 'success', message: 'restaurant was successfully created' })
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hour: req.body.opening_hour,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId
      }).then(() => {
        cb({ status: 'success', message: 'restaurant was successfully created' })
      })
    }
  },
  putRestaurant: (req, res, cb) => {
    if (!req.body.name) {
      return cb({ status: 'error', message: "name doesn't exist" })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (e, img) => {
        if (e) console.log(e)
        return Restaurant.findByPk(req.params.id).then(restaurant => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hour: req.body.opening_hour,
            description: req.body.description,
            image: file ? img.data.link : restaurant.image,
            CategoryId: req.body.categoryId
          }).then(restaurant => {
            cb({ status: 'success', message: 'restaurant was successfully edited' })
          })
        })
      })
    } else {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hour: req.body.opening_hour,
          description: req.body.description,
          image: restaurant.image,
          CategoryId: req.body.categoryId
        }).then(() => {
          cb({ status: 'success', message: 'restaurant was successfully edited' })
        })
      })
    }
  }
}

module.exports = adminService