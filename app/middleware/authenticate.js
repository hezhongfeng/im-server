module.exports = options => {
  return async function authenticate(ctx, next) {
    await next();
  };
};
