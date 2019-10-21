const Service = require('egg').Service;

class LoginService extends Service {
  async create() {
    const ctx = this.ctx;
    const { username, password } = ctx.request.body;
    const auth = await ctx.model.Authorization.findOne({ where: { provider: 'local', username } });
    if (auth) {
      ctx.body = {
        code: '101',
        message: '用户名重复',
      };
      return;
    }

    try {
      const auth = await ctx.model.Authorization.create({ provider: 'local', username, password });
      ctx.body = {
        id: auth.id,
      };
    } catch (error) {
      console.warn('error', error.errors[0].validatorKey);
    }
  }
}

module.exports = LoginService;
