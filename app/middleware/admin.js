module.exports = () => {
  return async function admin(ctx, next) {
    let { session } = ctx;

    // 判断admin角色
    if (session.user && session.user.roles.some(role => role === 'admin')) {
      await next();
    } else {
      ctx.redirect('/login');
    }
  };
};
