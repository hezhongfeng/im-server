module.exports = async (ctx, githubUser) => {
  const { service } = ctx;
  const { provider, name, photo, displayName } = githubUser;
  ctx.logger.info('githubUser', { provider, name, photo, displayName });

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
      nickname: displayName,
      photo
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
