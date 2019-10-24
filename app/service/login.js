const Service = require('egg').Service;
const crypto = require('crypto');

class LoginService extends Service {
  async create({ provider, username, password }) {
    const { ctx, config } = this;
    const user = await ctx.model.User.findOne({ where: { provider, username } });
    if (user) {
      ctx.body = {
        errcode: '1', // 具体错误代码
        errmsg: '用户名重复'
      };
      return;
    }
    const secret = config.userConfig.secret;
    try {
      const user = await ctx.model.User.create({
        provider,
        username,
        password: crypto
          .createHmac('sha256', secret)
          .update(password)
          .digest('hex')
      });
      const userInfo = await ctx.model.UserInfo.create({
        nickname: username
      });
      user.setUser(userInfo);
      ctx.body = {
        errcode: 0,
        errmsg: null,
        data: { id: user.id }
      };
    } catch (error) {
      console.warn('error', error);
    }
  }

  async login({ provider, username, password }) {
    const { ctx, config } = this;

    if (provider === 'local') {
      const secret = config.userConfig.secret;
      const user = await ctx.model.User.findOne({ where: { provider, username } });
      if (!user) {
        ctx.body = {
          errcode: '1',
          errmsg: '用户名错误'
        };
        return;
      }
      if (
        user.password !==
        crypto
          .createHmac('sha256', secret)
          .update(password)
          .digest('hex')
      ) {
        ctx.body = {
          errcode: '1',
          errmsg: '密码错误'
        };
        return;
      }
      ctx.session.user = user;
      ctx.body = {
        errcode: 0,
        errmsg: null,
        data: { id: user.id }
      };
    }
  }
}

module.exports = LoginService;
