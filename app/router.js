module.exports = app => {
  require('./router/v1/login')(app);
  require('./router/v1/restful')(app);
  require('./router/v1/io')(app);
};
