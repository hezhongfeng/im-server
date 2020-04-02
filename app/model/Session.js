module.exports = app => {
  const { STRING, JSON, INTEGER, BOOLEAN, DATE, NOW } = app.Sequelize;

  const Session = app.model.define('session', {
    /**
     * 消息类型：
     * chat:单聊
     * groupchat:群聊
     */
    type: {
      type: STRING
    },
    // 是否置顶
    isTop: {
      type: BOOLEAN,
      defaultValue: false
    },
    // 置顶时间
    topTime: {
      type: DATE,
      defaultValue: NOW
    },
    targetId: {
      type: STRING,
      allowNull: false
    }
  });

  return Session;
};
