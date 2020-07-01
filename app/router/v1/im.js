module.exports = app => {
  const { io } = app;

  const speak = app.middleware.speak();

  // 加入群
  io.of('/').route('/v1/im/join', app.io.controller.im.join);
  // 发送消息
  io.of('/').route('/v1/im/new-message', speak, app.io.controller.im.newMessage);
  // 查询消息
  io.of('/').route('/v1/im/get-messages', app.io.controller.im.getMessages);
};
