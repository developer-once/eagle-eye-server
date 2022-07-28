'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * --- 新增 页面PV/UV Table ---
     */
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('page', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      // ---- Base ----
      event_type:  STRING(200),
      app_key: STRING(200),
      uuid: STRING(200),
      ip: STRING(100),

      // ---- Pages ----
      view_type: STRING(100),

      // ---- Browser ----
      referrer: STRING(500),
      referrer_hash: STRING(100),
      user_agent: STRING(500),
      user_agent_hash: STRING(100),
      platform: STRING(500),
      language: STRING(500),
      app_name: STRING(500),
      app_version: STRING(500),
      app_version_hash: STRING(100),

      // ---- User ----
      user_id: STRING(100),

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
    await queryInterface.dropTable('page');
  }
};
