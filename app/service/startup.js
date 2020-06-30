const Service = require('egg').Service;
const crypto = require('crypto');

class startupService extends Service {
  async start() {
    const { ctx } = this;

    let adminRole = await this.addRole('管理员', 'admin');
    let adminRight = await this.addRight('管理', 'admin');

    let userRole = await this.addRole('用户', 'user');
    let loginRight = await this.addRight('登录', 'login');
    let speakRight = await this.addRight('发言', 'speak');
    adminRole.addRight(adminRight);
    adminRole.addRight(loginRight);
    userRole.addRight(loginRight);
    userRole.addRight(speakRight);

    await this.addUser('admin', '123456', [adminRole]);
    const hezf = await this.addUser('hezf', '123456', [userRole]);
    const laohe = await this.addUser('laohe', '123456', [userRole]);
    const xiaohe = await this.addUser('xiaohe', '123456', [userRole]);
    const member1 = await this.addUser('member1', '123456', [userRole]);
    const member2 = await this.addUser('member2', '123456', [userRole]);
    await ctx.service.apply.create({
      type: 'user',
      fromId: member1.id,
      toId: hezf.id
    });
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
    await this.addUser('member3', '123456', [userRole]);
    await this.addUser('member4', '123456', [userRole]);
    await this.addUser('member5', '123456', [userRole]);
    await this.addUser('member6', '123456', [userRole]);
    await this.addUser('member7', '123456', [userRole]);
    await this.addUser('member8', '123456', [userRole]);
    await this.addUser('member9', '123456', [userRole]);
    await this.addUser('member10', '123456', [userRole]);
    await this.addUser('member11', '123456', [userRole]);
    await this.addUser('member12', '123456', [userRole]);
    await this.addUser('member13', '123456', [userRole]);
    await this.addUser('member14', '123456', [userRole]);
    await this.addUser('member15', '123456', [userRole]);
    await this.addUser('member16', '123456', [userRole]);
    await this.addUser('member17', '123456', [userRole]);
    await this.addUser('member18', '123456', [userRole]);
    await this.addUser('member19', '123456', [userRole]);
    await this.addUser('member20', '123456', [userRole]);
    await this.addUser('member21', '123456', [userRole]);
    await this.addUser('member22', '123456', [userRole]);
    await this.addUser('member23', '123456', [userRole]);
    await this.addUser('member24', '123456', [userRole]);
    await this.addUser('member25', '123456', [userRole]);
    await this.addUser('member26', '123456', [userRole]);
    await this.addUser('member27', '123456', [userRole]);
    await this.addUser('member28', '123456', [userRole]);
    await this.addUser('member29', '123456', [userRole]);
    await this.addUser('member30', '123456', [userRole]);
  }

  async addUser(username, password, roles) {
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
    const userStatus = await ctx.model.UserStatus.create();
    await user.setUserInfo(userInfo);
    await user.setUserStatus(userStatus);
    for (const role of roles) {
      await user.addRole(role);
    }

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
      keyName,
      desc: '默认权限，请不要操作！！！'
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
