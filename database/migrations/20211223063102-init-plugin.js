'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * --- 新增 监控项目 Plugin ---
     */
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('plugin', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      app_key: STRING(100),
      plugin_key: STRING(100),
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
    await queryInterface.dropTable('plugin');
  }
};
