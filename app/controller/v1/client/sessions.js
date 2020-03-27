const Controller = require('egg').Controller;

class SessionController extends Controller {
  // INDEX
  async index() {
    const { ctx } = this;

    const option = {
      offset: ctx.query.pageNumber,
      limit: ctx.query.pageSize
    };
    const user = ctx.session.user;

    ctx.body = await user.getSessions(option);
  }

  // POST
  async create() {
    const { ctx } = this;
    const role = await ctx.model.Role.create(ctx.request.body);

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: role
    };
  }
}

module.exports = SessionController;
