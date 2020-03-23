module.exports = app => {
  const { STRING, JSON, INTEGER, BOOLEAN } = app.Sequelize;

  const Message = app.model.define('message', {
    /**
     * 消息类型：
     * 0:单聊
     * 1:群聊
     */
    type: {
      type: STRING
    },
    hasRead: {
      type: BOOLEAN
    },
    // 消息体
    body: {
      type: JSON
    },
    fromId: { type: INTEGER },
    toId: { type: INTEGER }
  });

  return Message;
};
