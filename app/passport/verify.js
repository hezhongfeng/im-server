const assert = require('assert');

module.exports = async (ctx, user) => {
  const { provider, id, name, photo } = user;
  assert(provider, 'user.provider should exists');
  if (provider === 'github') {
    const user = await ctx.model.User.findOne({
      where: {
        provider,
        uid: id
      }
    });
    if (!user) {
      const newUser = await ctx.model.User.create({
        provider,
        uid: id,
        username: name
      });
      const userInfo = await ctx.model.UserInfo.create({
        nickname: name,
        photo
      });
      newUser.setUserInfo(userInfo);
      ctx.session.user = newUser;
    } else {
      ctx.session.user = user;
    }
  }
  return user;
};
