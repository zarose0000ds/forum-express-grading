const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    Category.findAll({ raw: true, nest: true }).then(categories => {
      if (req.params.id) {
        return Category.findByPk(req.params.id).then(category => {
          res.render('admin/categories', { categories, category: category.toJSON() })
        })
      }
      return res.render('admin/categories', { categories })
    })
  },
  postCategory: (req, res) => {
    if (!req.body.categoryName) {
      req.flash('error_messages', '請輸入類型名稱！')
      return res.redirect('back')
    }
    return Category.create({ name: req.body.categoryName }).then(() => {
      res.redirect('/admin/categories')
    })
  },
  putCategory: (req, res) => {
    if (!req.body.categoryName) {
      req.flash('error_messages', '請輸入類型名稱！')
      return res.redirect('back')
    }
    return Category.findByPk(req.params.id).then(category => {
      category.update({
        name: req.body.categoryName
      }).then(() => res.redirect('/admin/categories'))
    })
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id).then(category => {
      category.destroy().then(() => {
        res.redirect('/admin/categories')
      })
    })
  }
}

module.exports = categoryController