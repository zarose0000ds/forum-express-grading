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
  }
}

module.exports = categoryService