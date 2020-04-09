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
        groups
      },
    };
  }
}

module.exports = AddController;
