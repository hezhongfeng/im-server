const Service = require('egg').Service;

class userService extends Service {
  async getUserAttribute(id) {
    const { ctx } = this;
    const user = await ctx.model.User.findByPk(id);
    const userInfo = await user.getUserInfo();
    const roles = await user.getRoles().map(item => {
      delete item.user_role;
      return item;
    });
    const rights = [];
    for (const role of roles) {
      const tempRights = await role.getRights();
      rights.concat(tempRights);
      for (const right of tempRights) {
        if (!rights.some(item => item.id === right.id)) {
          delete right.role_role;
          right.get({
            plain: true
          });
          rights.push(right);
        }
      }
    }
    for (const role of roles) {
      role.get({
        plain: true
      });
    }
    return {
      userInfo,
      roles,
      rights
    };
  }
}

module.exports = userService;
