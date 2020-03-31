module.exports = app => {
  const { io } = app;

  // socket.io
  io.of('/').route('server', io.controller.chat.ping);
  // 加入群
  io.of('/').route('/v1/cs/join-room', app.io.controller.im.joinRoom);
  // Client发送消息
  io.of('/').route('/v1/im/new-message', app.io.controller.im.newMessage);

};
