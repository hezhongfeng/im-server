module.exports = app => {
  const { STRING, DATE, BOOLEAN, ENUM } = app.Sequelize;

  const Conversation = app.model.define('conversation', {
    /**
     * 会话类型：
     * chat:单聊
     * groupchat:群聊
     */
    type: {
      type: ENUM,
      values: ['chat', 'groupchat']
    },
    // 激活时间，用来给会话列表排序
    activeTime: {
      type: DATE
    },
    // 是否激活
    active: {
      type: BOOLEAN,
      defaultValue: true
    }
  });

  Conversation.associate = function () {
    // One-To-Many associations
    app.model.Conversation.hasMany(app.model.Message);
  };

  return Conversation;
};
