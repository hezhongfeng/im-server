// 授权中间件处理
module.exports = () => {
  return async (ctx, next) => {
    const { query } = ctx.socket.handshake;
    ctx.logger.info('connect: ', query);
    switch (query.scene) {
      case 'cs':
        // notice这里的异步需要注意
        ctx.service.cs.connect(ctx.socket);
        break;
      case 'rescue':
        ctx.service.rescue.connect(ctx.socket);
        break;
      default:
        break;
    }
    await next();
    ctx.logger.info('disconnect: ', query);
    switch (query.scene) {
      case 'cs':
        ctx.service.cs.disconnect(ctx.socket);
        break;
      case 'rescue':
        ctx.service.rescue.disconnect(ctx.socket);
        break;
      default:
        break;
    }
  };
};
