const verify = require('./app/passport/verify');

module.exports = app => {
  // 初始化Table
  app.beforeStart(async () => {
    await app.model.sync();
  });

  // passport鉴权
  app.passport.verify(verify);
};
