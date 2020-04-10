const Controller = require('egg').Controller;

class AddController extends Controller {
  async search() {
    const { ctx } = this;

    const { searchValue } = ctx.request.body;

    const groups = await ctx.model.Group.findAll({ where: { name: searchValue } });
    const users = await ctx.model.User.findAll({ where: { username: searchValue } });

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: {
        users,
        groups,
      },
    };
  }

  async addFriend() {
    const { ctx } = this;

    // const { id } = ctx.request.body;
    // const groups = await ctx.model.Group.findAll({ where: { name: searchValue } });
    // const users = await ctx.model.User.findAll({ where: { username: searchValue } });

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: null,
    };
  }

  async getMailList() {
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
        updatedAt: iterator.updatedAt,
      };
      if (conversation.type === 'chat') {
        let users = await iterator.getUsers({
          where: {
            id: {
              [Op.ne]: ctx.session.user.id,
            },
          },
        });
        let user = users.pop();
        conversation.target = {
          id: user.id,
          type: user.type,
          name: user.username,
        };
      } else if (conversation.type === 'groupchat') {
        let group = await ctx.model.Group.findOne({
          where: {
            conversationId: iterator.id,
          },
        });
        conversation.target = {
          id: group.id,
          type: group.type,
          name: group.name,
        };
      }
      data.push(conversation);
    }
    data.sort((a, b) => a.target.name.charCodeAt(0) - b.target.name.charCodeAt(0));

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: data,
    };
  }
}

module.exports = AddController;
