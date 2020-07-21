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
        nickname: username,
        photo: `/public/images/head${Math.floor(Math.random() * 9 + 1)}.png`
      });
      const role = await ctx.model.Role.findOne({
        where: {
          keyName: 'user'
        }
      });
      const group = await ctx.model.Group.findOne({ where: { disabled: false } });
      user.setUserInfo(userInfo);
      user.addRole(role);
      if (group) {
        group.addUser(user);
        await group.save();
      }
      await user.save();
      await role.save();
      const rights = await role.getRights();
      const roles = [role];
      ctx.session.user = {
        id: user.id,
        roles,
        rights
      };
      ctx.body = {
        statusCode: '0',
        errorMessage: null,
        data: {
          userInfo,
          rights,
          roles,
          id: user.id
        }
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
      const { userInfo, rights, roles } = await service.user.getUserAttribute(user.id);

      // 权限判断
      if (!rights.some(item => item.keyName === 'login')) {
        ctx.body = {
          statusCode: '1',
          errorMessage: '不具备登录权限'
        };
        return;
      }

      ctx.session.user = {
        id: user.id,
        roles,
        rights
      };

      ctx.body = {
        statusCode: '0',
        errorMessage: null,
        data: {
          userInfo,
          rights,
          roles,
          id: user.id
        }
      };
    }
  }
}

module.exports = LoginService;
