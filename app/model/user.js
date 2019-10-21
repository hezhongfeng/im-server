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

  User.associate = function() {
    app.model.User.belongsTo(app.model.Authorization);
  };

  return User;
};
