'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * --- 新增 用户上报 Table ---
     */
    const { INTEGER, DATE, STRING, JSON } = Sequelize;
    await queryInterface.createTable('user_report', {
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


      // ---- Click ----
      click_dom: STRING(100),
      click_type: STRING(100),
      click_hash: STRING(100),

      // ---- Pages ----
      view_type: STRING(100),

      // // ---- Error ----
      // error_msg_filename: STRING(400),
      // error_msg_line: STRING(100),
      // error_msg_message: STRING(2000),
      // error_stack: STRING(2000),
      // error_fingerprint: STRING(200),

      // ---- Report ----
      data: JSON,

      // ---- Browser ----
      referrer: STRING(500),
      referrer_hash: STRING(100),
      user_agent: STRING(500),
      platform: STRING(500),
      language: STRING(500),
      app_name: STRING(500),
      app_version: STRING(500),

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
    await queryInterface.dropTable('user_report');
  }
};
