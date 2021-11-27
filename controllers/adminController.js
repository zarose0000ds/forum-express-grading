const fs = require('fs')
const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const User = db.User
const Category = db.Category
const Restaurant = db.Restaurant

const adminService = require('../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, data => {
      return res.render('admin/restaurants', data)
    })
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, data => {
      return res.render('admin/restaurant', data)
    })
  },
  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true }).then(categories => {
      return res.render('admin/create', { categories })
    })
  },
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '未填寫餐廳名稱！')
      return res.redirect('back')
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
          req.flash('success_messages', '新增成功')
          return res.redirect('/admin/restaurants')
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
        req.flash('success_messages', '新增成功')
        res.redirect('/admin/restaurants')
      })
    }
  },
  editRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        return res.render('admin/create', { restaurant: restaurant.toJSON(), categories })
      })
    })
  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '未填寫餐廳名稱！')
      return res.redirect('back')
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
            req.flash('success_messages', '修改成功')
            res.redirect('/admin/restaurants')
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
          req.flash('success_messages', '修改成功')
          res.redirect('/admin/restaurants')
        })
      })
    }
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => restaurant.destroy()).then(() => {
      res.redirect('/admin/restaurants')
    })
  },
  getUsers: (req, res) => {
    return User.findAll({ raw: true, order: [['id', 'asc']] }).then(users => {
      return res.render('admin/users', { users })
    })
  },
  toggleAdmin: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      if (user.email === 'root@example.com') {
        req.flash('error_messages', '禁止變更管理者權限')
        return res.redirect('back')
      }
      user.update({
        isAdmin: user.isAdmin ? false : true
      }).then(() => {
        req.flash('success_messages', '使用者權限變更成功')
        return res.redirect('/admin/users')
      })
    })
  }
}

module.exports = adminController