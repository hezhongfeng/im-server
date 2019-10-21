module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const User = app.model.define('user', {
    nickname: {
      type: STRING,
    },
    photo: {
      type: STRING,
    },
  });

  return User;
};
