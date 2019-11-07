module.exports = app => {
  const { router, controller } = app;

  router.resources('userinfo', '/api/v1/admin/userinfo', controller.v1.admin.userInfo);
  router.resources('roles', '/api/v1/admin/roles', controller.v1.admin.roles);
  router.resources('rights', '/api/v1/admin/rights', controller.v1.admin.rights);

  router.get('/api/v1/admin/users/:userId/roles', controller.v1.admin.user.getRoles);
  router.put('/api/v1/admin/users/:userId/roles', controller.v1.admin.user.updateRoles);

  router.get('/api/v1/admin/roles/:roleId/rights', controller.v1.admin.role.getRights);
  router.put('/api/v1/admin/roles/:roleId/rights', controller.v1.admin.role.updateRights);
};
