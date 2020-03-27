module.exports = app => {
  const { router, controller } = app;

  router.resources('sessions', '/api/v1/admin/users/:userId/sessions', controller.v1.client.sessions);
  // router.resources('rights', '/api/v1/admin/rights', controller.v1.admin.rights);
  // router.get('/api/v1/admin/users/:userId/sessions', controller.v1.admin.sessions);
};
