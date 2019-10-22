const Service = require('egg').Service;

class UserService extends Service {
  async create(nickname, photo) {
    const { ctx } = this;
    const auth = await ctx.model.User.create({ nickname, photo });
    return auth;
  }
}

module.exports = UserService;
