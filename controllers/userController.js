const bcrypt = require('bcryptjs')
const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const helpers = require('../_helpers')

const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    // CONFIRM PASSWORD
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // CONFIRM UNIQUE USER
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [Restaurant] },
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    }).then(user => {
      user = {
        ...user.toJSON(),
        isFollowed: req.user.Followings.map(item => item.id).includes(user.id)
      }
      // REMOVE DUPLICATED RESTAURANTS ON THE COMMENTS LIST
      const tempRestaurantId = user.Comments.map(c => c.RestaurantId)
      for (let i = 0; i < tempRestaurantId.length; i++) {
        if (tempRestaurantId.indexOf(tempRestaurantId[i], i + 1) >= 0) {
          tempRestaurantId.splice(i, 1)
          user.Comments.splice(i, 1)
          i--
        }
      }
      res.render('profile', { user })
    })
  },
  editUser: (req, res) => {
    if (Number(req.params.id) !== Number(helpers.getUser(req).id)) {
      req.flash('error_messages', '存取被拒！')
      return res.redirect(`/users/${req.params.id}`)
    }
    return User.findByPk(req.params.id).then(user => {
      res.render('edit', { user: user.toJSON() })
    })
  },
  putUser: (req, res) => {
    if (!req.body.name || !req.body.email) {
      req.flash('error_messages', '所有欄位不得為空！')
      res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (e, img) => {
        if (e) console.log(e)
        return User.findByPk(req.params.id).then(user => {
          user.update({
            name: req.body.name,
            email: req.body.email,
            image: file ? img.data.link : user.image
          }).then(() => {
            req.flash('success_messages', '使用者資料編輯成功')
            res.redirect(`/users/${req.params.id}`)
          })
        })
      })
    } else {
      return User.findByPk(req.params.id).then(user => {
        user.update({
          name: req.body.name,
          email: req.body.email,
          image: user.image
        }).then(() => {
          req.flash('success_messages', '使用者資料編輯成功')
          res.redirect(`/users/${req.params.id}`)
        })
      })
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(() => res.redirect('back'))
  },
  removeFavorite: (req, res) => {
    return Favorite.destroy({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(() => res.redirect('back'))
  },
  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    }).then(() => res.redirect('back'))
  },
  removeLike: (req, res) => {
    return Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    }).then(() => res.redirect('back'))
  },
  getTopUser: (req, res) => {
    return User.findAll({
      order: [['id', 'desc']],
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(item => item.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users })
    })
  },
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    }).then(() => res.redirect('back'))
  },
  removeFollowing: (req, res) => {
    return Followship.destroy({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    }).then(() => res.redirect('back'))
  }
}

module.exports = userController