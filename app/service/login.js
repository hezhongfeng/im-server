const Service = require('egg').Service;

class LoginService extends Service {
  async create() {
    const ctx = this.ctx;
    const { username, password } = ctx.request.body;
    const auth = await ctx.model.Authorization.create({ provider: 'local', username, password });
    ctx.body = auth;
  }
}

module.exports = LoginService;
