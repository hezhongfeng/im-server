module.exports = app => {
  const { STRING, DATE, BOOLEAN } = app.Sequelize;

  const Conversation = app.model.define('conversation', {
    /**
     * 会话类型：
     * chat:单聊
     * groupchat:群聊
     */
    type: {
      type: STRING
    },
    activeTime: {
      type: DATE
    },
    active: {
      type: BOOLEAN,
      defaultValue: true
    }
  });

  Conversation.associate = function() {
    // One-To-Many associations
    app.model.Conversation.hasMany(app.model.Message);

    // Many-To-Many associations
    // app.model.Conversation.belongsToMany(app.model.User, { through: 'user_conversation' });
  };

  return Conversation;
};
