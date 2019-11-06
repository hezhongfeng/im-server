module.exports = app => {
  const { router, controller } = app;

  router.resources('userinfo', '/api/v1/admin/userinfo', controller.v1.admin.userInfo);
};
