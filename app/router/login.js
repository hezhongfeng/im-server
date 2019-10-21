module.exports = app => {
  const { router, controller } = app;
  // 鉴权成功后的回调页面
  // router.get('/authCallback', controller.home.authCallback);
  // 渲染登录页面，用户输入账号密码
  // router.get('/login', controller.home.login);
  // 登录校验
  // router.post('/login', app.passport.authenticate('local', { successRedirect: '/authCallback' }));
  // signup
  // router.get('/signup', controller.home.login);
  router.post('/v1/signup', controller.v1.login.signup);
  // router.resources('users', '/api/v1/users', controller.v1.users);

  // github登录授权
  const github = app.passport.authenticate('github', {});
  router.get('/passport/github', github);
  router.get('/passport/github/callback', github);
};
