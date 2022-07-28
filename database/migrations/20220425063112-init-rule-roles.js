'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * --- 权限表 ---
     */
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('rule_role', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: INTEGER,
      // --- 项目权限 ---
      // --- project_12_admin ---
      code: STRING(100),
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
    await queryInterface.dropTable('rule_role');
  }
};
