module.exports = app => {
  require('./router/v1/login')(app);
  require('./router/v1/restful')(app);
  require('./router/v1/im')(app);
  require('./router/v1/add')(app);
  require('./router/v1/upload')(app);
  require('./router/v1/admin')(app);
};
