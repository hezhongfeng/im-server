const Controller = require('egg').Controller;

class LoginController extends Controller {
  async signup() {
    const { ctx, service } = this;
    const req = Object.assign(ctx.request.body);
    // 调用 Service 进行业务处理
    service.login.create(req);
  }
}

module.exports = LoginController;
