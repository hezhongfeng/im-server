const Controller = require('egg').Controller;

class UserInfoController extends Controller {
  // GET
  async show() {
    const { ctx } = this;
    const user = await ctx.model.User.findByPk(ctx.params.id);
    const userInfo = await user.getUserInfo();
    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: userInfo
    };
  }

  // PUT
  async update() {
    const { ctx } = this;
    console.log(ctx.request.body);
    const { id, nickname, photo, sign } = ctx.request.body;
    const userInfo = await ctx.model.UserInfo.findByPk(id);
    await userInfo.update({
      nickname,
      photo,
      sign
    });
    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: {}
    };
  }
}

module.exports = UserInfoController;
