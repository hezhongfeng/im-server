const assert = require('assert');

module.exports = async (ctx, user) => {
  const { service } = ctx;
  const { provider, name, photo } = user;
  assert(provider, 'user.provider should exists');
  if (provider === 'github') {
    let user = await ctx.model.User.findOne({
      where: {
        username: name
      }
    });
    if (!user) {
      user = await ctx.model.User.create({
        provider,
        username: name
      });
      const userInfo = await ctx.model.UserInfo.create({
        nickname: name,
        photo
      });
      user.setUserInfo(userInfo);
      // ctx.session.user = user;
    } else {
      // ctx.session.user = user;
    }
    const { rights, roles } = await service.user.getUserAttribute(user.id);

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
  }
  return user;
};
