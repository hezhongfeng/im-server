module.exports = app => {
  const { JSON, INTEGER } = app.Sequelize;

  const Message = app.model.define('message', {
    // 消息体
    body: {
      type: JSON
    },
    fromId: { type: INTEGER },
    toId: { type: INTEGER }
  });

  return Message;
};
