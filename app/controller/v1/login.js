const Controller = require('egg').Controller;

class LoginController extends Controller {
  async signup() {
    const { service, ctx } = this;

    const { username, password } = ctx.request.body;

    const params = {
      provider: 'local',
      username,
      password
    };

    // 校验参数
    try {
      const createRule = {
        username: { type: 'string', min: 4 },
        password: { type: 'string', min: 6 }
      };
      ctx.validate(createRule, params);
    } catch (error) {
      ctx.body = {
        errcode: '1',
        errmsg: '参数校验失败'
      };
      return;
    }

    // 调用 Service 进行业务处理
    await service.login.create(params);
  }

  async login() {
    const { service, ctx } = this;
    const { username, password } = ctx.request.body;

    const params = {
      provider: 'local',
      username,
      password
    };

    try {
      const createRule = {
        username: { type: 'string', min: 4 },
        password: { type: 'string', min: 5 }
      };
      ctx.validate(createRule, params);
    } catch (error) {
      ctx.body = {
        errcode: '1',
        errmsg: '参数校验失败'
      };
      return;
    }

    await service.login.login(params);
  }
}

module.exports = LoginController;
