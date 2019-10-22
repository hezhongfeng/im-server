const Controller = require('egg').Controller;

class LoginController extends Controller {
  async signup() {
    const { service, ctx } = this;
    const { username, password } = ctx.request.body;
    // 调用 Service 进行业务处理
    await service.login.create({
      provider: 'local',
      username,
      password
    });
  }

  async login() {
    const { username, password } = ctx.request.body;

    await this.service.login.login({
      provider: 'local',
      username,
      password
    });
  }
}

module.exports = LoginController;
