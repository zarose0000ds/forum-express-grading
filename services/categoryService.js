const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, cb) => {
    Category.findAll({ raw: true, nest: true }).then(categories => {
      if (req.params.id) {
        return Category.findByPk(req.params.id).then(category => {
          cb({ categories, category: category.toJSON() })
        })
      }
      cb({ categories })
    })
  },
  postCategory: (req, res, cb) => {
    if (!req.body.categoryName) {
      return cb({ status: 'error', message: '請輸入類型名稱！' })
    }
    Category.create({ name: req.body.categoryName }).then(() => {
      cb({ status: 'success', message: '類型建立成功' })
    })
  },
  putCategory: (req, res, cb) => {
    if (!req.body.categoryName) {
      return cb({ status: 'error', message: '請輸入類型名稱！' })
    }
    Category.findByPk(req.params.id).then(category => {
      category.update({
        name: req.body.categoryName
      }).then(() => cb({ status: 'success', message: '類型編輯成功' }))
    })
  }
}

module.exports = categoryService