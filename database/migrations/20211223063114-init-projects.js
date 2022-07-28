'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * --- 新增 监控项目 Table ---
     */
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('project', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: STRING(30),
      app_key: STRING(200),
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
    await queryInterface.dropTable('project');
  }
};
