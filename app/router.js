module.exports = app => {
  const { router, controller } = app;

  require('./router/login')(app);
  require('./router/io')(app);

  router.get('/', controller.v1.home.index);
};
