const Controller = require('egg').Controller;

class GroupController extends Controller {
  async index() {
    const { ctx } = this;

    // 注意这里需要经过两次查询
    const user = await ctx.model.User.findByPk(ctx.session.user.id);
    const data = await user.getGroups();

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: data
    };
  }

  async show() {
    const { ctx } = this;
    const group = await ctx.model.Group.findByPk(ctx.params.id);

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: group
    };
  }
}

module.exports = GroupController;
