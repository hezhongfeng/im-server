const Controller = require('egg').Controller;

class DefaultController extends Controller {
  async newMessage(ctx) {
    // const { ctx } = this;
    // const message = ctx.args[0];
    // await ctx.socket.emit('res', `Hi! I've got your message: ${message}`);

    const payload = ctx.args[0];
    // 统一时间戳
    payload.timestamp = new Date().getTime().toString();
    switch (payload.chat_type) {
      case 'chat':
        await ctx.service.io.sendUserMessage(payload.to.id, payload);
        // await ctx.service.cs.sendMessageToCs(payload.from.id, payload);
        // // 注意对象的变化
        // await ctx.service.cs.saveMessageFromCsToClient(payload);
        break;
      case 'groupchat':
        // const res = await ctx.service.cs.saveMessageFromGroup(payload);
        // payload.id = res.id;
        ctx.service.io.sendMessage(payload.to.id, payload);
        break;
      default:
        break;
    }
  }

  async joinRoom(ctx) {
    const payload = ctx.args[0];
    await ctx.socket.join(payload.roomId);
  }
}

module.exports = DefaultController;
