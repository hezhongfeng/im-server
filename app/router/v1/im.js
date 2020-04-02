module.exports = app => {
  const { io } = app;

  // socket.io
  io.of('/').route('server', io.controller.chat.ping);
  // 加入群
  io.of('/').route('/v1/im/join-room', app.io.controller.im.joinRoom);
  // 发送消息
  io.of('/').route('/v1/im/new-message', app.io.controller.im.newMessage);
  // 查询消息
  io.of('/').route('/v1/im/get-messages', app.io.controller.im.getMessage);
};
