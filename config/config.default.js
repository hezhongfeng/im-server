/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1568190347866_4750';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  config.userConfig = {
    secret: 'im-server'
  };

  config.io = {
    namespace: {
      '/': {
        connectionMiddleware: [ 'auth' ],
        packetMiddleware: [ 'packet' ]
      }
    }
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'im-db',
    username: 'root',
    password: 'root'
  };

  config.security = {
    csrf: {
      enable: false
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

  return {
    ...config
  };
};
