module.exports = app => {
  const { router, controller } = app;

  router.resources('userinfo', '/api/v1/userinfo', controller.v1.userInfo);
  router.resources('conversations', '/api/v1/conversations', controller.v1.conversations);
  router.resources('groups', '/api/v1/groups', controller.v1.groups);
  router.resources('applies', '/api/v1/applies', controller.v1.apply);
  router.resources('friend', '/api/v1/friend', controller.v1.friend);
};
