const Controller = require('egg').Controller;

class ApplyController extends Controller {
  // INDEX
  async index() {
    const { ctx } = this;

    const data = await ctx.model.Apply.findAndCountAll({
      where: {
        toId: ctx.session.user.id
      }
    });

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: data
    };
  }
}

module.exports = ApplyController;
