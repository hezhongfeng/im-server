module.exports = (app) => {
  const { router, controller } = app;

  // 搜索好友
  router.post('/api/v1/add/search', controller.v1.add.search);
  // 添加好友
  router.post('/api/v1/add/friend', controller.v1.add.search);
  // 申请进群
  router.post('/api/v1/add/group', controller.v1.add.search);
  // 通讯录
  router.get('/api/v1/mail-list', controller.v1.add.getMailList);
};
