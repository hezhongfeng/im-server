const Service = require('egg').Service;
const crypto = require('crypto');

class startupService extends Service {
  async start() {
    let admin = await this.addUser('admin', '123456');
    let user = await this.addUser('hezf', '123456');
    let laohe = await this.addUser('laohe', '123456');
    let xiaohe = await this.addUser('xiaohe', '123456');
    await this.addConversation({ type: 'chat', userList: [user, laohe] });
    await this.addConversation({ type: 'chat', userList: [user, xiaohe] });

    await this.addGroup({ name: '谈笑有鸿儒', disabled: false, userList: [user, laohe] });
    await this.addGroup({ name: '往来无白丁', disabled: false, userList: [user, laohe, xiaohe] });
    let role = await this.addRole('管理员', 'admin');
    let right = await this.addRight('管理', 'admin');
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
    await user.setUserInfo(userInfo);
    return user;
  }

  async addGroup({ name, disabled, photo = '', userList }) {
    const { ctx } = this;
    let group = await ctx.model.Group.findOne({ where: { name } });
    if (group) {
      return group;
    }
    const conversation = await ctx.model.Conversation.create({
      type: 'groupchat',
    });
    group = await ctx.model.Group.create({
      name,
      photo,
      disabled,
    });
    await group.setConversation(conversation);
    for (const user of userList) {
      await conversation.addUser(user);
      await group.addUser(user);
    }
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

  async addConversation({ type, userList }) {
    const { ctx } = this;
    if (userList.length <= 1) {
      return;
    }
    // 判断是否已经有了 会话
    const user1Conversations = await userList[0].getConversations({
      where: {
        type: type,
      },
    });
    const user2Conversations = await userList[1].getConversations({
      where: {
        type: type,
      },
    });

    for (const user1Conversation of user1Conversations) {
      for (const user2Conversation of user2Conversations) {
        if (user1Conversation.id === user2Conversation.id) {
          return;
        }
      }
    }

    const conversation = await ctx.model.Conversation.create({
      type: type,
    });

    for (const user of userList) {
      conversation.addUser(user);
    }
  }
}

module.exports = startupService;
