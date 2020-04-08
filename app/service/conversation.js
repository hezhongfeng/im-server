const Service = require('egg').Service;

class ConversationService extends Service {
  async create({ user, targetId, type }) {
    // try {
    //   user.addConversation({
    //     targetId,
    //     type
    //   });
    // } catch (error) {
    //   console.warn('error', error);
    // }
  }
}

module.exports = ConversationService;
