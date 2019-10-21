module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const User = app.model.define('authorization', {
    provider: { type: STRING },
    uid: { type: STRING },
    username: { type: STRING, unique: true },
    password: { type: STRING },
  });

  return User;
};
