const Controller = require('egg').Controller;

class ConversationController extends Controller {
  // INDEX
  async index() {
    const { ctx } = this;
    const { Op } = this.app.Sequelize;

    // 注意这里需要经过两次查询
    const user = await ctx.model.User.findByPk(ctx.session.user.id);
    let conversations = await user.getConversations();

    let data = [];
    for (const iterator of conversations) {
      let conversation = {
        id: iterator.id,
        type: iterator.type,
        updatedAt: iterator.user_conversation.updatedAt,
      };
      if (conversation.type === 'chat') {
        let users = await iterator.getUsers({
          where: {
            id: {
              [Op.ne]: ctx.session.user.id,
            },
          },
        });
        conversation.targetId = users.pop().id;
      } else if (conversation.type === 'groupchat') {
        let group = await ctx.model.Group.findOne({
          where: {
            conversationId: iterator.id,
          },
        });
        conversation.targetId = group.id;
      }
      data.push(conversation);
    }
    data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: data,
    };
  }
}

module.exports = ConversationController;
