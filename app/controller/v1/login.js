const Controller = require('egg').Controller;

class LoginController extends Controller {
  async signup() {
    const { service } = this;
    // 调用 Service 进行业务处理
    await service.login.create();
  }
}

module.exports = LoginController;
