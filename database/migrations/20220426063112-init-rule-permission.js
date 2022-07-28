'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * --- 权限表 ---
     */
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('rule_permissions', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      // --- project_12_admin ---
      role_code: STRING(100),
      project_id: INTEGER,
      // --- R、U、D ---
      operation: STRING(10),
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
    await queryInterface.dropTable('rule_permissions');
  }
};
