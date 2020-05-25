const Service = require('egg').Service;
const crypto = require('crypto');

class LoginService extends Service {
  async create({ provider, username, password }) {
    const { ctx, config, service } = this;
    const user = await ctx.model.User.findOne({ where: { provider, username } });
    if (user) {
      ctx.body = {
        statusCode: '1', // 具体错误代码
        errorMessage: '用户名重复'
      };
      return;
    }
    const secret = config.userConfig.secret;
    try {
      const user = await ctx.model.User.create({
        provider,
        username,
        password: crypto.createHmac('sha256', secret).update(password).digest('hex')
      });
      const userInfo = await ctx.model.UserInfo.create({
        nickname: username
      });
      user.setUserInfo(userInfo);
      ctx.session.user = {
        id: user.id,
        roles:  await user.getRoles().map(item => item.keyName)
      };
      const object = await service.user.getUserAttribute();
      ctx.body = {
        statusCode: '0',
        errorMessage: null,
        data: Object.assign(object, { id: user.id })
      };
    } catch (error) {
      console.warn('error', error);
    }
  }

  async login({ provider, username, password }) {
    const { ctx, config, service } = this;

    if (provider === 'local') {
      const secret = config.userConfig.secret;
      const user = await ctx.model.User.findOne({ where: { provider, username } });
      if (!user) {
        ctx.body = {
          statusCode: '1',
          errorMessage: '用户名错误'
        };
        return;
      }
      if (user.password !== crypto.createHmac('sha256', secret).update(password).digest('hex')) {
        ctx.body = {
          statusCode: '1',
          errorMessage: '密码错误'
        };
        return;
      }
      ctx.session.user = {
        id: user.id,
        roles:  await user.getRoles().map(item => item.keyName)
      };
      const object = await service.user.getUserAttribute();
      ctx.body = {
        statusCode: '0',
        errorMessage: null,
        data: Object.assign(object, { id: user.id })
      };
    }
  }
}

module.exports = LoginService;
