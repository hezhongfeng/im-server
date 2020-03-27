module.exports = options => {
  return async function authenticate(ctx, next) {
    let { path, session } = ctx;
    let whileList = ['/signup', '/login', '/api/v1/login'];
    if (whileList.indexOf(path) === -1 && !session.user) {
      ctx.redirect('/login');
    } else {
      await next();
    }
  };
};
