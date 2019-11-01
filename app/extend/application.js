// const axios = require('axios');
// const HTTP = Symbol('Application#http');

// // 统一处理
// const responseHandle = function(response) {
//   return new Promise(function(resolve, reject) {
//     const data = response.data;
//     if (data.resultCode === '100') {
//       resolve(data);
//     } else {
//       reject(data);
//     }
//   });
// };

module.exports = {
  // get http() {
  //   if (!this[HTTP]) {
  //     this[HTTP] = {
  //       get: async (url, params) => {
  //         const response = await axios.get(this.config.business.dir + this.config.business.port + url, {
  //           params
  //         });
  //         this.logger.info('http-method:get', url, params, response.data);
  //         return responseHandle(response);
  //       },
  //       post: async (url, params) => {
  //         const response = await axios.post(this.config.business.dir + this.config.business.port + url, params);
  //         this.logger.info('http-method:post', url, params, response.data);
  //         return responseHandle(response);
  //       },
  //       put: async (url, params) => {
  //         const response = await axios.put(this.config.business.dir + this.config.business.port + url, params);
  //         this.logger.info('http-method:put', url, params, response.data);
  //         return responseHandle(response);
  //       },
  //       delete: async (url, params) => {
  //         const response = await axios.delete(this.config.business.dir + this.config.business.port + url, {
  //           data: params
  //         });
  //         this.logger.info('http-method:delete', url, params, response.data);
  //         return responseHandle(response);
  //       }
  //     };
  //   }
  //   return this[HTTP];
  // },
  // get checkAdmin() {
  //   const { service } = this;
  //   service.checkAdmin();
  // }
};
