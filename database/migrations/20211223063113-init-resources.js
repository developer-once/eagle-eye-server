'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * --- 新增 静态 - 资源加载 Table ---
     */
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('resource', {
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

      // ---- Resource ----
      resource_url:  STRING(2000),
      resource_url_hash: STRING(100),
      name: STRING(1000),
      entryType: STRING(50),
      initiatorType: STRING(50),
      nextHopProtocol: STRING(50),
      loading: INTEGER,
      prepareLoading: INTEGER,
      transferSize: INTEGER,

      // ---- Browser ----
      referrer: STRING(500),
      referrer_hash: STRING(100),
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
    await queryInterface.dropTable('resource');
  }
};
