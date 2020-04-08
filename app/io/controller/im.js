const Controller = require('egg').Controller;

class DefaultController extends Controller {
  async newMessage(ctx) {
    const message = ctx.args[0];
    await ctx.service.im.sendMessage(message);
  }

  async join(ctx) {
    const payload = ctx.args[0];
    await ctx.socket.join(payload.conversationId);
  }

  async getMessages(ctx) {
    const payload = ctx.args[0];
    ctx.service.im.getMessages(payload);
  }
}

module.exports = DefaultController;
