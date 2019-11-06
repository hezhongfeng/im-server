const Service = require('egg').Service;

class userService extends Service {
  async getUserAttribute() {
    const { ctx } = this;
    const user = ctx.model.User.findByPk(ctx.session.user.id);
    const userInfo = user.getUserInfo();
    const roles = user.getRoles();
    const rights = [];
    for (const role of roles) {
      rights.concat(role.getRights());
    }
    return {
      userInfo,
      roles,
      rights
    };
  }
}

module.exports = userService;
