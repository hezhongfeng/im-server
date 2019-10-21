const LocalPassport = require('./app/passport/local');
const verify = require('./app/passport/verify');

module.exports = app => {
  // 初始化Table
  app.beforeStart(async () => {
    await app.model.sync({ force: true });
  });

  // 挂载 passport
  LocalPassport(app);

  // 校验用户信息
  app.passport.verify(verify);
};
