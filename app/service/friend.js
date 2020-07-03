const Service = require('egg').Service;

class FriendService extends Service {
  async create({ userId, friendId }) {
    const { ctx } = this;

    // 选取较小的作为userId插入数据
    const temp = userId;
    userId = temp < friendId ? temp : friendId;
    friendId = temp < friendId ? friendId : temp;

    // result 是一个数组 [friend, created]
    const [friend, created] = await ctx.model.Friend.findOrCreate({
      where: {
        userId,
        friendId
      }
    });
    // 申请会话
    if (created) {
      const conversation = await ctx.model.Conversation.create({
        type: 'chat'
      });
      await friend.setConversation(conversation);
    }

    return [friend, created];
  }

  async getFriends({ userId }) {
    const { ctx } = this;
    const { Op } = this.app.Sequelize;

    const friends = await ctx.model.Friend.findAll({
      where: {
        [Op.or]: [
          {
            userId: userId
          },
          {
            friendId: userId
          }
        ]
      }
    });

    const data = [];

    for (const iterator of friends) {
      const friendId = iterator.userId === userId ? iterator.friendId : iterator.userId;
      let user = await ctx.model.User.findOne({
        where: {
          id: friendId
        },
        attributes: { exclude: ['password'] }
      });
      let userInfo = await user.getUserInfo();
      let conversation = await iterator.getConversation();
      userInfo = userInfo.get({
        plain: true
      });
      user = user.get({
        plain: true
      });
      conversation = conversation.get({
        plain: true
      });
      user.userInfo = userInfo;
      user.conversation = conversation;
      data.push(user);
    }

    return data;
  }

  async isFriend({ userId, friendId }) {
    const { ctx } = this;
    // 选取较小的作为userId插入数据
    const temp = userId;
    userId = temp < friendId ? temp : friendId;
    friendId = temp < friendId ? friendId : temp;

    return await ctx.model.Friend.findOne({
      where: {
        userId,
        friendId
      }
    });
  }
}

module.exports = FriendService;
