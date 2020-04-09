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
        statusCode: '1',
        errorMessage: '参数校验失败'
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
        password: { type: 'string', min: 4 }
      };
      ctx.validate(createRule, params);
    } catch (error) {
      ctx.body = {
        statusCode: '1',
        errorMessage: '参数校验失败'
      };
      return;
    }

    await service.login.login(params);
  }

  async logout() {
    const { ctx } = this;
    ctx.session.user = null;

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: null
    };
  }
}

module.exports = LoginController;
