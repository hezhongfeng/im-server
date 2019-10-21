module.exports = app => {
  const { router, controller } = app;

  require('./router/login')(app);

  router.get('/', controller.home.index);
};
