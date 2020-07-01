module.exports = () => {
  return async function speak(ctx, next) {
    let { session } = ctx;

    // 判断发言权限
    if (session.user && session.user.rights.some(right => right.keyName === 'speak')) {
      await next();
    }
  };
};
