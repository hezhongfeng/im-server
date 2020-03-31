const Controller = require('egg').Controller;

class SessionController extends Controller {
  // INDEX
  async index() {
    const { ctx } = this;

    // 注意这里需要经过两次查询
    const user = await ctx.model.User.findByPk(ctx.session.user.id);
    const sessions = await user.getSessions();

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: sessions
    };
  }

  async show() {
    // const { ctx } = this;

    // // 注意这里需要经过两次查询
    // const user = await ctx.model.User.findByPk(ctx.params.id);
    // const sessions = await user.getSessions();

    // ctx.body = {
    //   statusCode: '0',
    //   errorMessage: null,
    //   data: sessions
    // };
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
