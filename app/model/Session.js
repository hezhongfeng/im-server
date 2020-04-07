module.exports = (app) => {
  const { STRING } = app.Sequelize;

  const Session = app.model.define('session', {
    /**
     * 会话类型：
     * chat:单聊
     * groupchat:群聊
     */
    type: {
      type: STRING,
    },
  });

  Session.associate = function () {
    // One-To-Many associations
    app.model.Session.hasMany(app.model.Message);

    // Many-To-Many associations
    app.model.Session.belongsToMany(app.model.User, { through: 'user_session' });
  };

  return Session;
};
