'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * --- 新增 API - 接口加载 Table ---
     */
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('user', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      password: STRING(200),
      salt: STRING(200),
      email: STRING(100),
      name: STRING(1000),
      createdAt: DATE,
      updatedAt: DATE,
    }, {
      timestamps: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('user');
  }
};
