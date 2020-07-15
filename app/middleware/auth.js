module.exports = options => {
  return async function authenticate(ctx, next) {
    let { path, session } = ctx;
    let whileList = ['/api/v1/signup', '/api/v1/login', '/api/v1/passport/github', '/api/v1/passport/github/callback'];
    if (whileList.indexOf(path) === -1 && !session.user) {
      ctx.body = {
        statusCode: '1',
        errorMessage: '请登录',
        data: null
      };
      return;
    } else {
      await next();
    }
  };
};
