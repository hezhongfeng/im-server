module.exports = app => {
  require('./router/v1/login')(app);
  require('./router/v1/admin/restful')(app);
  require('./router/v1/client/session')(app);
  require('./router/v1/io')(app);
};
