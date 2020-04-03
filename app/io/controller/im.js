const Controller = require('egg').Controller;

class DefaultController extends Controller {
  async newMessage(ctx) {
    const message = ctx.args[0];
    await ctx.service.im.sendMessage(message);
    // 统一时间戳
    // message.timestamp = new Date().getTime().toString();
    // switch (message.type) {
    //   case 'chat':
    //     await ctx.service.im.sendUserMessage(message.toId, message);
    //     break;
    //   case 'groupchat':

    //     break;
    //   default:
    //     break;
    // }
  }

  async join(ctx) {
    const payload = ctx.args[0];
    await ctx.socket.join(payload.sessionId);
  }

  async getMessage(ctx) {
    const payload = ctx.args[0];
    ctx.service.im.getMessages(payload);
  }
}

module.exports = DefaultController;
