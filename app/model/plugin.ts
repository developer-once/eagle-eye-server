module.exports = app => {
  const {
    INTEGER,
    STRING,
    DATE,
  } = app.Sequelize;

  const Plugin = app.model.define('plugin', {
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
    freezeTableName: true,
    timestamps: true
  });

  return Plugin;
};