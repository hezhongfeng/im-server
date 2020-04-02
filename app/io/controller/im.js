const Controller = require('egg').Controller;

class DefaultController extends Controller {
  async newMessage(ctx) {
    const payload = ctx.args[0];
    // 统一时间戳
    payload.timestamp = new Date().getTime().toString();
    switch (payload.type) {
      case 'chat':
        await ctx.service.im.sendUserMessage(payload.toId, payload);
        break;
      case 'groupchat':
        await ctx.service.im.sendMessage(payload.toId, payload);
        break;
      default:
        break;
    }
  }

  async joinRoom(ctx) {
    const payload = ctx.args[0];
    await ctx.socket.join(payload.roomId);
  }

  async getMessage(ctx) {
    const payload = ctx.args[0];
    ctx.service.im.getMessages(payload);
  }
}

module.exports = DefaultController;
