const Controller = require('egg').Controller;

class ConversationController extends Controller {
  // INDEX
  async index() {
    const { ctx } = this;

    // 注意这里需要经过两次查询
    const user = await ctx.model.User.findByPk(ctx.session.user.id);
    const friends = await ctx.service.friend.getFriends({ userId: ctx.session.user.id });
    const groups = await user.getGroups({
      where: {
        disabled: false
      }
    });

    const data = [];

    for (const friendUser of friends) {
      const conversation = friendUser.conversation;
      delete friendUser.conversation;
      conversation.target = friendUser;
      data.push(conversation);
    }
    for (const group of groups) {
      let conversation = await ctx.model.Conversation.findByPk(group.conversationId);
      conversation = conversation.get({
        plain: true
      });
      conversation.target = group;
      data.push(conversation);
    }
    data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: data
    };
  }

  async active() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    const conversation = await ctx.model.Conversation.findByPk(id);
    conversation.activeTime = new Date();
    await conversation.save();

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: null
    };
  }
}

module.exports = ConversationController;
