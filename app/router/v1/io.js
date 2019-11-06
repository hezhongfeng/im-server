module.exports = app => {
  const { io } = app;

  // socket.io
  io.of('/').route('server', io.controller.chat.ping);
};
