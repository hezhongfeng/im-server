const path = require('path');

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1568190347866_4750';

  // add your middleware config here
  config.middleware = ['auth'];

  // add your user config here
  config.userConfig = {
    secret: 'im-server'
  };

  config.io = {
    namespace: {
      '/': {
        connectionMiddleware: ['auth'],
        packetMiddleware: ['packet']
      }
    }
  };

  config.sequelize = {
    timezone: '+08:00',
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'im-db',
    username: 'root',
    password: 'root',
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    }
  };

  config.security = {
    csrf: {
      enable: false
    }
  };

  config.cluster = {
    listen: {
      port: 7001,
      hostname: '127.0.0.1'
    }
  };

  config.passportGithub = {
    key: '6a295fd08ea8affe1e75',
    secret: '14b892e4f36cf08303f40553bc24fcbae61aa4bb',
    callbackURL: '/v1/passport/github/callback'
  };

  config.logger = {
    dir: path.join(appInfo.baseDir, 'logs', appInfo.name),
    consoleLevel: 'DEBUG'
  };

  config.multipart = {
    mode: 'file',
    fileSize: '3mb',
    fileExtensions: ['.mov']
  };

  config.bodyParser = {
    jsonLimit: '1mb',
    formLimit: '10mb'
  };

  config.static = {
    prefix: '/public/',
    dir: path.join(appInfo.baseDir, 'public')
  };

  return {
    ...config
  };
};
