const Service = require('egg').Service;

class ApplyService extends Service {
  async create({ type, fromId, toId }) {
    const { ctx } = this;
    let toUser = null;
    if (type === 'user') {
      toUser = await ctx.model.User.findByPk(toId);
    } else if (type === 'group') {
      const toGroup = await ctx.model.Group.findByPk(toId);
      toUser = await ctx.model.User.findByPk(toGroup.ownerId);
    }
    const apply = await ctx.model.Apply.findOrCreate({
      where: {
        type,
        fromId,
        toId
      }
    });
    await toUser.addApply(apply);
    return apply;
  }

  async approvalAddGroup({ fromId, group }) {
    const ids = [];
    const fromUser = await this.ctx.model.User.findByPk(fromId);
    const fromUserConversations = await fromUser.getConversations({
      where: {
        type: 'groupchat'
      }
    });
    for (const iterator of fromUserConversations) {
      ids.push(iterator.id);
    }

    const toGroupConversation = await group.getConversation();

    // 判断是否已经有了 会话
    if (ids.some(id => id === toGroupConversation.id)) {
      return;
    }
    await toGroupConversation.addUser(fromUser);
    await group.addUser(fromUser);
  }
}

module.exports = ApplyService;
