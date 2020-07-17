const Controller = require('egg').Controller;

class DefaultController extends Controller {
  async newMessage(ctx) {
    const message = ctx.args[0];

    if (message.type === 'robot') {
      await ctx.service.im.robot(message);
      return;
    }
    // 对用户发言的权限进行判断
    if (!ctx.session.user.rights.some(right => right.keyName === 'speak')) {
      return;
    }

    // 处理群组的状态
    if (message.type === 'groupchat') {
      const group = await ctx.model.Group.findOne({
        where: {
          conversationId: message.conversationId
        }
      });
      if (group.disabled || group.mute) {
        return;
      }
    }

    await ctx.service.im.sendMessage(message);
  }

  async join(ctx) {
    const payload = ctx.args[0];
    await ctx.socket.join(payload.conversationId);
  }

  async getMessages(ctx) {
    const payload = ctx.args[0];
    const callBack = ctx.args[1];
    ctx.service.im.getMessages(payload, callBack);
  }
}

module.exports = DefaultController;
