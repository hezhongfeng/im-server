module.exports = app => {
  require('./router/v1/amdin/login')(app);
  require('./router/v1/amdin/io')(app);
};
