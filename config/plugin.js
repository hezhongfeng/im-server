'use strict';

exports.io = {
  enable: true,
  package: 'egg-socket.io'
};

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize'
};

exports.validate = {
  enable: true,
  package: 'egg-validate'
};

exports.session = {
  key: 'IM_SESS',
  maxAge: 1 * 3600 * 1000
};

module.exports.passport = {
  enable: true,
  package: 'egg-passport'
};

module.exports.passportGithub = {
  enable: true,
  package: 'egg-passport-github'
};

exports.cancan = {
  enable: true,
  package: 'egg-cancan'
};
