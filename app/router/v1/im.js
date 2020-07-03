module.exports = app => {
  const { io, router, controller } = app;

  // 加入群
  io.of('/').route('/v1/im/join', app.io.controller.im.join);
  // 发送消息
  io.of('/').route('/v1/im/new-message', app.io.controller.im.newMessage);
  // 查询消息
  io.of('/').route('/v1/im/get-messages', app.io.controller.im.getMessages);

  // 激活会话
  router.put('/api/v1/conversations/active', controller.v1.conversations.active);
};
