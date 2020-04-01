// 授权中间件处理
module.exports = () => {
  return async (ctx, next) => {
    const { query } = ctx.socket.handshake;
    ctx.logger.info('connect: ', query);
    switch (query.scene) {
      case 'im':
        ctx.service.io.connect(ctx.socket);
        break;
      default:
        break;
    }
    await next();
    ctx.logger.info('disconnect: ', query);
    switch (query.scene) {
      case 'im':
        ctx.service.io.disconnect(ctx.socket);
        break;
      default:
        break;
    }
  };
};
