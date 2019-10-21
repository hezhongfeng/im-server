const Service = require('egg').Service;

class UserService extends Service {
  async create(username, passwprd) {
    const ctx = this.ctx;
    const { username, password } = ctx.request.body;
    const auth = await ctx.model.Authorization.create({ provider: 'local', username, password });
    ctx.body = auth;
  }
}

module.exports = UserService;
