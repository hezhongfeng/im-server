const axios = require('axios');
const HTTP = Symbol('Application#http');

// 统一处理

module.exports = {
  get http() {
    if (!this[HTTP]) {
      this[HTTP] = {
        get: (url, params) => {
          this.logger.info('http-method:get', url, params);
          return axios.get(url, {
            params
          });
        },
        post: (url, params) => {
          this.logger.info('http-method:post', url, params);
          return axios.post(this.config.business.dir + this.config.business.port + url, params);
        },
        put: (url, params) => {
          this.logger.info('http-method:put', url, params);
          return axios.put(this.config.business.dir + this.config.business.port + url, params);
        },
        delete: (url, params) => {
          this.logger.info('http-method:delete', url, params);
          return axios.delete(this.config.business.dir + this.config.business.port + url, {
            data: params
          });
        }
      };
    }
    return this[HTTP];
  }
};
