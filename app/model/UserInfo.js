module.exports = app => {
  const { STRING } = app.Sequelize;

  const UserInfo = app.model.define('userInfo', {
    nickname: {
      type: STRING
    },
    photo: {
      type: STRING
    }
  });

  UserInfo.associate = function() {
    app.model.UserInfo.belongsTo(app.model.User);
  };

  return UserInfo;
};
