const Service = require('egg').Service;

class SessionService extends Service {
  async create({ user, targetId, type }) {
    try {
      user.addSession({
        targetId,
        type
      });
    } catch (error) {
      console.warn('error', error);
    }
  }
}

module.exports = SessionService;
