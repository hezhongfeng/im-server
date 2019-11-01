const Service = require('egg').Service;
const crypto = require('crypto');

class startupService extends Service {
  async checkAdmin() {
    const { ctx, config } = this;
    const admin = await ctx.model.User.findOne({ where: { provider: 'local', username: 'admin' } });
    if (admin) {
      return;
    }
    const secret = config.userConfig.secret;
    const user = await ctx.model.User.create({
      provider: 'local',
      username: 'admin',
      password: crypto
        .createHmac('sha256', secret)
        .update('admin')
        .digest('hex')
    });
    const userInfo = await ctx.model.UserInfo.create({
      nickname: 'admin'
    });
    user.setUserInfo(userInfo);
  }
}

module.exports = startupService;
