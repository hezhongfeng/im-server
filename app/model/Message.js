module.exports = app => {
  const { STRING, JSON, INTEGER } = app.Sequelize;

  const Message = app.model.define('message', {
    /**
     * 消息类型：
     * 0:单聊
     * 1:群聊
     */
    type: {
      type: STRING
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
