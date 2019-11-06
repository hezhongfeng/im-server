const Controller = require('egg').Controller;

class UserController extends Controller {
  async getUserInfo() {
    const { service, ctx } = this;
    const userInfo = ctx.model.User.findByPk(ctx.session.user.id).getUserInfo;
    ctx.body = {
      errcode: 0,
      errmsg: null,
      data: { userInfo }
    };
  }
}

module.exports = UserController;
