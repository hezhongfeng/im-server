const Service = require('egg').Service;

class ApplyService extends Service {
  async approvalAddFriend({ fromId, toId }) {
    const ids = [];
    const fromUser = await this.ctx.model.User.findByPk(fromId);
    const fromUserConversations = await fromUser.getConversations({
      where: {
        type: 'chat'
      }
    });
    for (const iterator of fromUserConversations) {
      ids.push(iterator.id);
    }

    const toUser = await this.ctx.model.User.findByPk(toId);
    const toUserConversations = await toUser.getConversations({
      where: {
        type: 'chat'
      }
    });
    for (const iterator of toUserConversations) {
      // 判断是否已经有了 会话
      if (ids.some(id => id === iterator.id)) {
        return;
      }
    }
    const conversation = await this.ctx.model.Conversation.create({
      type: 'chat'
    });

    conversation.addUser(fromUser);
    conversation.addUser(toUser);
    await conversation.save();
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
