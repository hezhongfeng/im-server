module.exports = app => {
  const { router, controller } = app;

  // 登录校验
  router.post('/v1/login', controller.v1.login.login);
  router.post('/v1/signup', controller.v1.login.signup);

  // github登录授权
  const github = app.passport.authenticate('github', { successRedirect: '/' });
  router.get('/v1/passport/github', github);
  router.get('/v1/passport/github/callback', github);
};
