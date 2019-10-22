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
    const { service, ctx } = this;
    const { username, password } = ctx.request.body;
    await service.login.login({
      provider: 'local',
      username,
      password
    });
  }

  async passport() {
    const { service, ctx } = this;
    console.log('ctx.request', ctx.request);
    ctx.body = {};
    // const { provider, password } = ctx.request.body;
    // await service.login.login({
    //   provider: 'github',
    //   username,
    //   password
    // });
  }
}

module.exports = LoginController;
