module.exports = app => {
  const { router, controller } = app;

  // 搜索好友
  router.post('/api/v1/add/search', controller.v1.add.search);
  // 同意添加好友
  router.post('/api/v1/add/friend', controller.v1.apply.applyFriend);
  // 同意申请进群
  router.post('/api/v1/add/group', controller.v1.apply.applyGroup);
};
