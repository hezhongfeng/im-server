module.exports = (app) => {
  const { router, controller } = app;

  // 搜索好友
  router.post('/api/v1/add/search', controller.v1.add.search);
};
