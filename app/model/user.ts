module.exports = app => {
  const {
    INTEGER,
    STRING,
    DATE,
  } = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    password: STRING(200),
    salt: STRING(400),
    email: STRING(100),
    name: STRING(1000),
    createdAt: DATE,
    updatedAt: DATE,
  }, {
    freezeTableName: true,
    timestamps: true
  });

  return User;
};