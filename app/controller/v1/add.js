const Controller = require('egg').Controller;

class AddController extends Controller {
  async search() {
    const { ctx } = this;

    const { searchValue } = ctx.request.body;

    const groups = await ctx.model.Group.findAll({ where: { name: searchValue } });
    const users = await ctx.model.User.findAll({
      where: { username: searchValue },
      attributes: { exclude: ['password'] }
    });
    const userInstances = [];
    for (const user of users) {
      const userInfo = await user.getUserInfo();
      const userInstance = user.get({
        plain: true
      });
      userInstance.userInfo = userInfo.get({
        plain: true
      });
      userInstances.push(userInstance);
    }

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: {
        users: userInstances,
        groups
      }
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
      data: null
    };
  }

  async getMailList() {
    const { ctx } = this;
    const { Op } = this.app.Sequelize;

    // 注意这里需要经过两次查询
    const user = await ctx.model.User.findByPk(ctx.session.user.id);
    const conversations = await user.getConversations({
      where: {
        type: 'chat'
      }
    });

    const data = [];
    for (const iterator of conversations) {
      const conversation = {
        id: iterator.id,
        type: iterator.type,
        updatedAt: iterator.updatedAt
      };

      const users = await iterator.getUsers({
        where: {
          id: {
            [Op.ne]: ctx.session.user.id
          }
        }
      });
      const user = users.pop();
      const userInfo = await user.getUserInfo();
      conversation.target = {
        id: user.id,
        type: user.type,
        name: user.username,
        userInfo: userInfo
      };

      data.push(conversation);
    }
    data.sort((a, b) => a.target.name.charCodeAt(0) - b.target.name.charCodeAt(0));

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: data
    };
  }

  async getGroupList() {
    const { ctx } = this;

    // 注意这里需要经过两次查询
    const user = await ctx.model.User.findByPk(ctx.session.user.id);
    const conversations = await user.getConversations({
      where: {
        type: 'groupchat'
      }
    });

    const data = [];
    for (const iterator of conversations) {
      const conversation = {
        id: iterator.id,
        type: iterator.type,
        updatedAt: iterator.updatedAt
      };
      const group = await ctx.model.Group.findOne({
        where: {
          conversationId: iterator.id
        }
      });
      conversation.target = {
        id: group.id,
        type: group.type,
        name: group.name,
        photo: group.photo
      };
      data.push(conversation);
    }
    data.sort((a, b) => a.target.name.charCodeAt(0) - b.target.name.charCodeAt(0));

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: data
    };
  }
}

module.exports = AddController;
