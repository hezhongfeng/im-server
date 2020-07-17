const Service = require('egg').Service;

class BaiduService extends Service {
  async getToken() {
    const params = {
      grant_type: 'client_credentials',
      client_id: this.app.config.baidu.client_id,
      client_secret: this.app.config.baidu.client_secret
    };
    this.app.http.get('https://aip.baidubce.com/oauth/2.0/token', params).then(data => {
      this.app.baiduToken = data.data.access_token;
    });
  }

  async chat(msg) {
    const params = {
      session_id: '666666',
      version: '2.0',
      service_id: this.app.config.baidu.service_id,
      skill_ids: this.app.config.baidu.skill_ids,
      log_id: 'testtest',
      request: {
        query: msg,
        user_id: 'test'
      }
    };
    return this.app.http.post('https://aip.baidubce.com/rpc/2.0/unit/service/chat?access_token=' + this.app.baiduToken, params);
  }
}

module.exports = BaiduService;
