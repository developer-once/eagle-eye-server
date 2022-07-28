
module.exports = app => {
  const {
    INTEGER,
    STRING,
    DATE,
  } = app.Sequelize;

  const Crash = app.model.define('crash_errors', {
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
    freezeTableName: true,
    timestamps: true
  });

  return Crash;
};