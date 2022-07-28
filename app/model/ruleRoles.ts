module.exports = app => {
  const {
    INTEGER,
    STRING,
    DATE,
  } = app.Sequelize;

  const RuleRoles = app.model.define('rule_role', {
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
    freezeTableName: true,
    timestamps: true
  });

  return RuleRoles;
};