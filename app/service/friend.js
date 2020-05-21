const Service = require('egg').Service;

class ApplyService extends Service {
  async create({ userId, friendId }) {
    const { ctx } = this;

    // 选取较小的作为userId插入数据
    const temp = userId;
    userId = temp < friendId ? temp : friendId;
    friendId = temp < friendId ? friendId : temp;

    // result 是一个数组 [friend, created]
    const result = await ctx.model.Friend.findOrCreate({
      where: {
        userId,
        friendId
      }
    });
    // 申请会话
    if (result.created) {
      const conversation = await ctx.model.Conversation.create({
        type: 'chat'
      });
      const user = await ctx.model.User.findByPk(userId);
      const friend = await ctx.model.User.findByPk(friendId);
      conversation.addUser(user);
      conversation.addUser(friend);
    }

    return result;
  }
}

module.exports = ApplyService;
