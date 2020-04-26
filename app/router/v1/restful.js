module.exports = app => {
  const { router, controller } = app;

  router.resources('userinfo', '/api/v1/userinfo', controller.v1.userInfo);
  router.resources('roles', '/api/v1/roles', controller.v1.roles);
  router.resources('rights', '/api/v1/rights', controller.v1.rights);
  router.resources('conversations', '/api/v1/conversations', controller.v1.conversations);
  router.resources('groups', '/api/v1/groups', controller.v1.groups);
  router.resources('applies', '/api/v1/applies', controller.v1.applies);
};
