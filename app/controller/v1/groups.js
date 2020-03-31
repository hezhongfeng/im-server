const Controller = require('egg').Controller;

class GroupController extends Controller {

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
