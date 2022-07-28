module.exports = app => {
  const {
    INTEGER,
    STRING,
    DATE,
  } = app.Sequelize;

  const RulePermission = app.model.define('rule_permissions', {
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
    freezeTableName: true,
    timestamps: true
  });

  return RulePermission;
};