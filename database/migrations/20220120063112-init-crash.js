'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * --- 新增 API - 接口加载 Table ---
     */
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('crash_errors', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      // ---- Base ----
      uuid: STRING(200),
      ip: STRING(100),
      app_key: STRING(200),
      
      // ---- Browser ----
      origin: STRING(500),
      user_agent: STRING(500),
      platform: STRING(500),
      language: STRING(500),
      app_name: STRING(500),
      app_version: STRING(500),

      // ---- DB ----
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
    await queryInterface.dropTable('crash_errors');
  }
};
