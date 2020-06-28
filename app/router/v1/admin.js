module.exports = app => {
  const { router, controller } = app;

  // 角色列表
  router.get('/api/v1/admin/roles', controller.v1.admin.rolesIndex);
  router.put('/api/v1/admin/roles', controller.v1.admin.rolesUpdate);

  // 群组列表
  router.get('/api/v1/admin/groups', controller.v1.admin.groupsIndex);
  router.put('/api/v1/admin/groups/disabled', controller.v1.admin.groupsDisabled);
  router.put('/api/v1/admin/groups/mute', controller.v1.admin.groupsMute);

  // 用户列表
  router.get('/api/v1/admin/users', controller.v1.admin.usersIndex);
  router.put('/api/v1/admin/users/disabled', controller.v1.admin.usersDisabled);
  router.put('/api/v1/admin/users/mute', controller.v1.admin.usersMute);
};
