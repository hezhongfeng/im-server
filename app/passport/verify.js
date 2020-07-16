module.exports = async (ctx, githubUser) => {
  const { service } = ctx;
  const { provider, name, photo, displayName } = githubUser;
  ctx.logger.info('githubUser', githubUser);

  let user = await ctx.model.User.findOne({
    where: {
      username: name
    }
  });
  if (!user) {
    newUser = await ctx.model.User.create({
      provider,
      username: name
    });
    const userInfo = await ctx.model.UserInfo.create({
      nickname: displayName,
      photo
    });
    const role = await ctx.model.Role.findOne({
      where: {
        keyName: 'user'
      }
    });
    user.setUserInfo(userInfo);
    user.addRole(role);
    await user.save();
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

  return githubUser;
};
