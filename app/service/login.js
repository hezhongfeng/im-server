const Service = require('egg').Service;

class LoginService extends Service {
  async create(uid) {
    // const user = await this.ctx.db.query('select * from user where uid = ?', uid);
    // return user;
  }
}

module.exports = LoginService;
