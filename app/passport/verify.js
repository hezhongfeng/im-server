module.exports = async (ctx, user, done) => {
  const { provider, id, username, password } = user;
  assert(provider, 'user.provider should exists');
  if (provider === 'local') {
    assert(username, 'user.username should exists');
    assert(password, 'user.password should exists');
  } else {
    assert(id, 'user.id should exists');
  }
  const auth = null;
  const existsUser = null;
  if (provider === 'local') {
    try {
      auth = await ctx.model.authorization.findOne({
        where: {
          provider,
          username,
        },
      });
      if (!auth) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (auth.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      const existsUser = await ctx.model.User.findOne({ id: auth.user_id });
      return done(null, existsUser);
    } catch (error) {
      return done(error);
    }
  }
  return done(null);
  // // 这里没有的话也需要注册用户表
  // auth = await ctx.model.authorization.findOne({
  //   where: {
  //     uid: user.id,
  //     password,
  //   },
  // });
  // // find user
  // const existsUser = await ctx.model.User.findOne({ id: auth.user_id });
  // if (existsUser) {
  //   return existsUser;
  // }
  // // 调用 service 注册新用户
  // const newUser = await ctx.service.user.register(user);
  // return newUser;

  // if (err) { return done(err); }
  // if (!user) {
  //   return done(null, false, { message: 'Incorrect username.' });
  // }
  // if (!user.validPassword(password)) {
  //   return done(null, false, { message: 'Incorrect password.' });
  // }
  // return done(null, user);
};
