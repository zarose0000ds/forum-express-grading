const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res) => {
    if (!req.body.text) {
      req.flash('error_messages', '留言內容不得為空！')
      return res.redirect('back')
    }
    return Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    }).then(() => res.redirect(`/restaurants/${req.body.restaurantId}`))
  },
  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id).then(comment => {
      const restaurantId = comment.RestaurantId
      comment.destroy().then(() => res.redirect(`/restaurants/${restaurantId}`))
    })
  }
}

module.exports = commentController