// io packet消息的预处理
module.exports = app => {
  return async (ctx, next) => {
    ctx.logger.info(ctx.packet[0], ctx.packet[1]);
    await next();
  };
};
