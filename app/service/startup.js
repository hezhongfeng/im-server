const Service = require('egg').Service;
const crypto = require('crypto');

class startupService extends Service {
  async start() {
    const { ctx } = this;

    let adminRole = await this.addRole('管理员', 'admin');
    let userRole = await this.addRole('用户', 'user');
    let disabledRole = await this.addRole('封禁', 'disabled');
    let muteRole = await this.addRole('禁言', 'mute');
    let adminRight = await this.addRight('管理', 'admin', '权限已使用，请不要操作！！！');
    let loginRight = await this.addRight('登录', 'login', '权限已使用，请不要操作！！！');
    let speakRight = await this.addRight('发言', 'speak', '权限已使用，请不要操作！！！');
    this.addRight('配置', 'conf');
    this.addRight('测试', 'test');
    adminRole.addRight(adminRight);
    adminRole.addRight(loginRight);
    userRole.addRight(loginRight);
    userRole.addRight(speakRight);
    muteRole.addRight(loginRight);

    await this.addUser('admin', '123456', [adminRole]);
    const user = await this.addUser('user', '123456', [userRole]);
    const disabledUser = await this.addUser('disabled', '123456', [disabledRole]);
    const muteUser = await this.addUser('muteuser', '123456', [muteRole]);
    const member1 = await this.addUser('member1', '123456', [userRole]);
    const member2 = await this.addUser('member2', '123456', [userRole]);
    const member3 = await this.addUser('member3', '123456', [userRole]);
    const member4 = await this.addUser('member4', '123456', [userRole]);
    const member5 = await this.addUser('member5', '123456', [userRole]);
    const member6 = await this.addUser('member6', '123456', [userRole]);
    const member7 = await this.addUser('member7', '123456', [userRole]);
    const member8 = await this.addUser('member8', '123456', [userRole]);
    const member9 = await this.addUser('member9', '123456', [userRole]);
    const member10 = await this.addUser('member10', '123456', [userRole]);
    const member11 = await this.addUser('member11', '123456', [userRole]);
    const member12 = await this.addUser('member12', '123456', [userRole]);
    const member13 = await this.addUser('member13', '123456', [userRole]);
    const member14 = await this.addUser('member14', '123456', [userRole]);
    const member15 = await this.addUser('member15', '123456', [userRole]);
    const member16 = await this.addUser('member16', '123456', [userRole]);
    const member17 = await this.addUser('member17', '123456', [userRole]);
    const member18 = await this.addUser('member18', '123456', [userRole]);
    const member19 = await this.addUser('member19', '123456', [userRole]);
    const member20 = await this.addUser('member20', '123456', [userRole]);
    const member21 = await this.addUser('member21', '123456', [userRole]);
    const member22 = await this.addUser('member22', '123456', [userRole]);
    const member23 = await this.addUser('member23', '123456', [userRole]);
    const member24 = await this.addUser('member24', '123456', [userRole]);
    const member25 = await this.addUser('member25', '123456', [userRole]);
    const member26 = await this.addUser('member26', '123456', [userRole]);
    await this.addUser('member27', '123456', [userRole]);
    await this.addUser('member28', '123456', [userRole]);
    await this.addUser('member29', '123456', [userRole]);
    await this.addUser('member30', '123456', [userRole]);

    await this.createFriendRelationship(user, disabledUser);
    await this.createFriendRelationship(user, muteUser);
    await this.createFriendRelationship(user, member3);
    await this.createFriendRelationship(user, member4);
    await this.createFriendRelationship(user, member5);
    await this.createFriendRelationship(user, member6);
    await this.createFriendRelationship(user, member7);
    await this.createFriendRelationship(user, member8);
    await this.createFriendRelationship(user, member9);
    await this.createFriendRelationship(user, member10);
    await this.createFriendRelationship(user, member11);
    await this.createFriendRelationship(user, member12);
    await this.createFriendRelationship(user, member13);
    await this.createFriendRelationship(user, member14);
    await this.createFriendRelationship(user, member15);
    await this.createFriendRelationship(user, member16);
    await this.createFriendRelationship(user, member17);
    await this.createFriendRelationship(user, member18);
    await this.createFriendRelationship(user, member19);
    await this.createFriendRelationship(user, member20);
    await this.createFriendRelationship(user, member21);
    await this.createFriendRelationship(user, member22);
    await this.createFriendRelationship(user, member23);
    await this.createFriendRelationship(user, member24);
    await this.createFriendRelationship(user, member25);
    await this.createFriendRelationship(user, member26);

    // 2个好友申请
    await ctx.service.apply.create({
      type: 'user',
      fromId: member1.id,
      toId: user.id
    });
    await ctx.service.apply.create({
      type: 'user',
      fromId: member2.id,
      toId: user.id
    });

    const group1 = await this.createGroup({
      name: '谈笑有鸿儒',
      disabled: false,
      userList: [
        user,
        disabledUser,
        muteUser,
        member1,
        member2,
        member3,
        member4,
        member5,
        member6,
        member7,
        member8,
        member9,
        member10
      ],
      owner: user
    });

    // 入群申请
    await ctx.service.apply.create({
      type: 'group',
      fromId: member11.id,
      toId: group1.id
    });
    await this.createGroup({
      name: '往来无白丁',
      disabled: false,
      userList: [
        user,
        disabledUser,
        muteUser,
        member1,
        member2,
        member3,
        member4,
        member5,
        member6,
        member7,
        member8,
        member9,
        member10
      ],
      owner: user
    });
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
      photo: `/public/images/head${Math.floor(Math.random() * 9 + 1)}.png`,
      sign: '念念不忘，必有回响~',
      nickname: username
    });
    await user.setUserInfo(userInfo);
    for (const role of roles) {
      await user.addRole(role);
    }

    return user;
  }

  // 创建群组
  async createGroup({ name, disabled, userList, owner }) {
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
      disabled,
      ownerId: owner.id,
      introduction: '富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善'
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

  async addRight(name, keyName, desc = '权限的描述性内容') {
    const { ctx } = this;
    let right = await ctx.model.Right.findOne({ where: { name } });
    if (right) {
      return right;
    }
    right = await ctx.model.Right.create({
      name,
      keyName,
      desc
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
