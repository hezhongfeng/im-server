module.exports = app => {
  const { STRING } = app.Sequelize;

  const UserInfo = app.model.define('userInfo', {
    nickname: {
      type: STRING
    },
    photo: {
      type: STRING,
      defaultValue: '/public/images/head1.png'
    },
    sign: {
      type: STRING
    }
  });

  return UserInfo;
};
