module.exports = app => {
  const { router, controller } = app;

  // 登录校验
  router.post('/api/v1/admin/login', controller.v1.admin.login.login);
  router.post('/api/v1/admin/signup', controller.v1.admin.login.signup);

  // github登录授权
  const github = app.passport.authenticate('github', { successRedirect: '/' });
  router.get('/api/v1/admin/passport/github', github);
  router.get('/api/v1/admin/passport/github/callback', github);
};
