module.exports = app => {
  const { BOOLEAN } = app.Sequelize;

  const UserStatus = app.model.define('userStatus', {
    // 是否禁止登录
    disabled: {
      type: BOOLEAN,
      defaultValue: false
    },
    // 是否禁言
    mute: {
      type: BOOLEAN,
      defaultValue: false
    }
  });

  return UserStatus;
};
