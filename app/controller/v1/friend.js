const Controller = require('egg').Controller;

class ApplyController extends Controller {
  // INDEX
  async index() {
    const { ctx } = this;

    const data = await ctx.service.friend.getFriends({ userId: ctx.session.user.id });

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data
    };
  }
}

module.exports = ApplyController;
