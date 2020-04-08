const Controller = require('egg').Controller;

class ConversationController extends Controller {
  // INDEX
  async index() {
    const { ctx } = this;

    // 注意这里需要经过两次查询
    const user = await ctx.model.User.findByPk(ctx.session.user.id);
    const Conversations = await user.getConversations();

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: Conversations
    };
  }
}

module.exports = ConversationController;
