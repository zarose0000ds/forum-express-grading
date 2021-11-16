'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments', [{
      text: 'Comment 1',
      UserId: 1,
      RestaurantId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      text: 'Comment 2',
      UserId: 1,
      RestaurantId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      text: 'Comment 3',
      UserId: 1,
      RestaurantId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      text: 'Comment 4',
      UserId: 1,
      RestaurantId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      text: 'Comment 5',
      UserId: 2,
      RestaurantId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
