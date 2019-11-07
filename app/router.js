module.exports = app => {
  require('./router/v1/admin/login')(app);
  require('./router/v1/admin/restful')(app);
  require('./router/v1/io')(app);
};
