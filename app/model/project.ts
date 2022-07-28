module.exports = app => {
  const {
    INTEGER,
    STRING,
    DATE,
  } = app.Sequelize;

  const Project = app.model.define('project', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: STRING(30),
    app_key: STRING(200),
    createdAt: DATE,
    updatedAt: DATE,
  }, {
    freezeTableName: true,
    timestamps: true
  });

  return Project;
};