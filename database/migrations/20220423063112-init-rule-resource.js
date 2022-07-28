'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * --- 权限资源表 ---
     */
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('rule_resources', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: STRING(50),
      code: STRING(50),
      type: STRING(50),
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
    await queryInterface.dropTable('rule_resources');
  }
};
