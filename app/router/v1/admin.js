module.exports = app => {
  const { router, controller } = app;

  const admin = app.middleware.admin();

  // 权限列表
  router.get('/api/v1/admin/rights', admin, controller.v1.admin.rightsIndex);
  router.post('/api/v1/admin/rights', admin, controller.v1.admin.rightsCreate);
  router.put('/api/v1/admin/rights', admin, controller.v1.admin.rightsUpdate);

  router.delete('/api/v1/admin/rights', admin, controller.v1.admin.rightsDelete);

  // 角色列表
  router.get('/api/v1/admin/roles', admin, controller.v1.admin.rolesIndex);
  router.post('/api/v1/admin/roles', admin, controller.v1.admin.createRoles);
  router.put('/api/v1/admin/roles', admin, controller.v1.admin.updateRoles);
  router.delete('/api/v1/admin/roles', admin, controller.v1.admin.deleteRoles);

  // 群组列表
  router.get('/api/v1/admin/groups', admin, controller.v1.admin.groupsIndex);
  router.put('/api/v1/admin/groups/disabled', admin, controller.v1.admin.groupsDisabled);
  router.put('/api/v1/admin/groups/mute', admin, controller.v1.admin.groupsMute);

  // 用户列表
  router.get('/api/v1/admin/users', admin, controller.v1.admin.usersIndex);
  router.put('/api/v1/admin/users/roles', admin, controller.v1.admin.usersRoles);
};
