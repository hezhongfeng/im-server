module.exports = app => {
  require('./router/v1/amdin/login')(app);
  require('./router/v1/amdin/userinfo')(app);
  require('./router/v1/io')(app);
};
