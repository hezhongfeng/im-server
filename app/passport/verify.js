const assert = require('assert');

module.exports = async (ctx, user) => {
  const { provider, id, name } = user;
  assert(provider, 'user.provider should exists');
  if (provider === 'github') {
    auth = await ctx.model.Authorization.findOne({
      where: {
        provider,
        uid: id
      }
    });
    if (!auth) {
      const newAuth = await ctx.model.Authorization.create({
        provider,
        uid: id,
        username: name
      });
      const user = await ctx.model.User.create({
        nickname: name
      });
      newAuth.setUser(user);
      ctx.session.auth = newAuth;
    } else {
      ctx.session.auth = auth;
    }
  }
  return user;
};
