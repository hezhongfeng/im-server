module.exports = () => {
  return async function admin(ctx, next) {
    let { session } = ctx;

    // 判断admin权限
    if (session.user && session.user.rights.some(right => right.keyName === 'admin')) {
      await next();
    } else {
      ctx.redirect('/login');
    }
  };
};
