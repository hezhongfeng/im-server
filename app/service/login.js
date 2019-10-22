const Service = require('egg').Service;
const crypto = require('crypto');

class LoginService extends Service {
  async create({ provider, username, password }) {
    const { ctx, config } = this;
    const auth = await ctx.model.Authorization.findOne({ where: { provider, username } });
    if (auth) {
      ctx.body = {
        errcode: '1', // 具体错误代码
        errmsg: '用户名重复'
      };
      return;
    }
    const secret = config.userConfig.secret;
    try {
      const auth = await ctx.model.Authorization.create({
        provider,
        username,
        password: crypto
          .createHmac('sha256', secret)
          .update(password)
          .digest('hex')
      });
      const user = await ctx.model.User.create({
        nickname: username
      });
      auth.setUser(user);
      ctx.body = {
        errcode: 0,
        errmsg: null,
        data: { id: auth.id }
      };
    } catch (error) {
      console.warn('error', error);
    }
  }

  async login({ provider, username, password }) {
    const { ctx, config } = this;

    if (provider === 'local') {
      const secret = config.userConfig.secret;
      const auth = await ctx.model.Authorization.findOne({ where: { provider, username } });
      if (!auth) {
        ctx.body = {
          errcode: '1',
          errmsg: '用户名错误'
        };
        return;
      }
      if (
        auth.password !==
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
      ctx.session.auth = auth;
      ctx.body = {
        errcode: 0,
        errmsg: null,
        data: { id: auth.id }
      };
    }
  }
}

module.exports = LoginService;
