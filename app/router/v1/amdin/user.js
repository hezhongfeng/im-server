module.exports = app => {
  const { router, controller } = app;

  router.get('/api/v1/admin/userinfo', controller.v1.admin.user.getUserInfo);
};
