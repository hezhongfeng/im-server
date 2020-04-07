const Service = require('egg').Service;
const crypto = require('crypto');

class startupService extends Service {
  async start() {
    let user = null;
    let admin = null;
    let group = null;
    let role = null;
    let right = null;
    admin = await this.addUser('admin', '123456');
    user = await this.addUser('hezf', '123456');
    let laohe = await this.addUser('laohe', '123456');
    await this.addSession({ type: 'chat', userList: [user, laohe] });
    group = await this.addGroup('群魔乱舞', false);
    group.addUser(user);
    group.addUser(laohe);

    group = await this.addGroup('小绵羊', false);
    group.addUser(user);
    role = await this.addRole('管理员', 'admin');
    right = await this.addRight('管理', 'admin');
    role.addRight(right);
    admin.addRole(role);
    role = await this.addRole('用户', 'user');
    right = await this.addRight('登录', 'login');
    role.addRight(right);
    right = await this.addRight('发言', 'speak');
    role.addRight(right);
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
      password: crypto.createHmac('sha256', secret).update(password).digest('hex'),
    });
    const userInfo = await ctx.model.UserInfo.create({
      nickname: username,
    });
    user.setUserInfo(userInfo);
    return user;
  }

  async addGroup(name, disabled, photo = '') {
    const { ctx } = this;
    let group = await ctx.model.Group.findOne({ where: { name } });
    if (group) {
      return group;
    }
    const session = await ctx.model.Session.create({
      type: 'groupchat',
    });
    group = await ctx.model.Group.create({
      name,
      photo,
      disabled,
    });
    await group.setSession(session);

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
      keyName,
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
      keyName,
    });
    return right;
  }

  async addSession({ type, userList }) {
    const { ctx } = this;
    if (userList.length <= 1) {
      return;
    }
    // 判断是否已经有了 session
    const user1Sessions = await userList[0].getSessions({
      where: {
        type: type,
      },
    });
    const user2Sessions = await userList[1].getSessions({
      where: {
        type: type,
      },
    });

    for (const user1Session of user1Sessions) {
      for (const user2Session of user2Sessions) {
        if (user1Session.id === user2Session.id) {
          return;
        }
      }
    }

    const session = await ctx.model.Session.create({
      type: type,
    });

    for (const user of userList) {
      session.addUser(user);
    }
  }
}

module.exports = startupService;
