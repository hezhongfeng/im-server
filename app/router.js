module.exports = app => {
  const { router, controller } = app;

  require('./router/login')(app);

  router.get('/', controller.v1.home.index);
};
