const Service = require('egg').Service;
const crypto = require('crypto');

class startupService extends Service {
  async start() {
    let user = null;
    let admin = null;
    let group = null;
    let role = null;
    let right = null;

    admin = await this.addUser('admin', 'admin');
    user = await this.addUser('user', 'user');
    group = await this.addGroup('群魔乱舞');
    group.addUser(user);
    group = await this.addGroup('小绵羊');
    group.addUser(user);
    role = await this.addRole('管理员', 'admin');
    right = await this.addRight('登录', 'login');
    role.addRight(right);
    right = await this.addRight('发言', 'speak');
    role.addRight(right);
    admin.addRole(role);
  }

  async addUser(username, password) {
    const { ctx, config } = this;
    let user = await ctx.model.User.findOne({ where: { provider: 'local', username } });
    if (user) {
      return user;
    }
    const secret = config.userConfig.secret;
    user = await ctx.model.User.create({
      provider: 'local',
      username,
      password: crypto
        .createHmac('sha256', secret)
        .update(password)
        .digest('hex')
    });
    const userInfo = await ctx.model.UserInfo.create({
      nickname: username
    });
    user.setUserInfo(userInfo);
    return user;
  }

  async addGroup(name, photo = '') {
    const { ctx } = this;
    let group = await ctx.model.Group.findOne({ where: { name } });
    if (group) {
      return group;
    }
    group = await ctx.model.Group.create({
      name,
      photo
    });

    return group;
  }

  async addRole(name, keyName) {
    const { ctx } = this;
    let role = await ctx.model.Role.findOne({ where: { name } });
    if (role) {
      return role;
    }
    role = await ctx.model.Role.create({
      name,
      keyName
    });
    return role;
  }

  async addRight(name, keyName) {
    const { ctx } = this;
    let right = await ctx.model.Right.findOne({ where: { name } });
    if (right) {
      return right;
    }
    right = await ctx.model.Right.create({
      name,
      keyName
    });
    return right;
  }
}

module.exports = startupService;
