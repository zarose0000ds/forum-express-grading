const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
      return res.render('admin/restaurant', { restaurant })
    })
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('warning_msg', '未填寫餐廳名稱！')
      return res.redirect('back')
    }
    
    return Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hour: req.body.opening_hour,
      description: req.body.description
    }).then(() => {
      req.flash('success_msg', '新增成功')
      res.redirect('/admin/restaurants')
    })
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
      return res.render('admin/create', { restaurant })
    })
  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('warning_msg', '未填寫餐廳名稱！')
      return res.redirect('back')
    }

    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hour: req.body.opening_hour,
          description: req.body.description
        }).then(() => {
          req.flash('success_msg', '修改成功')
          res.redirect('/admin/restaurants')
        })
      })
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => restaurant.destroy()).then(() => {
      res.redirect('/admin/restaurants')
    })
  }
}

module.exports = adminController