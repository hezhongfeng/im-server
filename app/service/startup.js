const Service = require('egg').Service;
const crypto = require('crypto');

class startupService extends Service {
  async start() {
    const { ctx } = this;

    const admin = await this.addUser('admin', '123456');
    const hezf = await this.addUser('hezf', '123456');
    const laohe = await this.addUser('laohe', '123456');
    const xiaohe = await this.addUser('xiaohe', '123456');
    const member1 = await this.addUser('member1', '123456');
    const member2 = await this.addUser('member2', '123456');
    await ctx.service.apply.create({
      type: 'user',
      fromId: member1.id,
      toId: hezf.id
    });
    await this.addUser('member2', '123456');
    await this.addUser('member3', '123456');
    await this.addUser('member4', '123456');
    await this.addUser('member5', '123456');
    await this.addUser('member6', '123456');
    await this.addUser('member7', '123456');
    await this.addUser('member8', '123456');
    await this.addUser('member9', '123456');
    await this.addUser('member10', '123456');
    await this.createFriendRelationship(hezf, laohe);
    await this.createFriendRelationship(hezf, xiaohe);

    const group1 = await this.createGroup({ name: '谈笑有鸿儒', disabled: false, userList: [hezf, laohe], owner: hezf });
    await ctx.service.apply.create({
      type: 'group',
      fromId: member2.id,
      toId: group1.id
    });
    await this.createGroup({
      name: '往来无白丁',
      disabled: false,
      userList: [laohe, hezf, xiaohe],
      owner: hezf
    });

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
      password: crypto.createHmac('sha256', secret).update(password).digest('hex')
    });
    const userInfo = await ctx.model.UserInfo.create({
      nickname: username
    });
    await user.setUserInfo(userInfo);
    return user;
  }

  // 创建群组
  async createGroup({ name, disabled, photo = '', userList, owner }) {
    const { ctx } = this;
    let group = await ctx.model.Group.findOne({ where: { name } });
    if (group) {
      return group;
    }
    const conversation = await ctx.model.Conversation.create({
      type: 'groupchat'
    });
    group = await ctx.model.Group.create({
      name,
      photo,
      disabled,
      ownerId: owner.id
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

  // 创建好友关系
  async createFriendRelationship(user, friend) {
    const { ctx } = this;

    await ctx.service.friend.create({
      userId: user.id,
      friendId: friend.id
    });
  }
}

module.exports = startupService;
