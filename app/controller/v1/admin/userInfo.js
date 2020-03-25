const Controller = require('egg').Controller;

class UserInfoController extends Controller {
  // GET
  async show() {
    const { ctx } = this;
    const userInfo = ctx.model.User.findByPk(ctx.params.id).getUserInfo();
    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: { userInfo }
    };
  }

  // PUT
  async update() {
    const { ctx } = this;
    console.log(ctx.request.body);
    const userInfo = ctx.model.UserInfo.findByPk(ctx.request.body.id);
    await userInfo.update(ctx.request.body);
    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: {}
    };
  }
}

module.exports = UserInfoController;
