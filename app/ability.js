const { BaseAbility } = require('egg-cancan');

class Ability extends BaseAbility {
  constructor(ctx, user) {
    super(ctx, user);
  }

  async rules(action, obj, options = {}) {
    const { type } = options;

    if (type === 'topic') {
      if (action === 'update') {
        return await this.canUpdateTopic(obj);
      }

      if (action === 'delete') {
        return await this.canDeleteTopic(obj);
      }
    }

    return true;
  }

  async canUpdateTopic(obj) {
    if (topic.user_id === this.user_id) return true;
    return false;
  }

  async canDeleteTopic(obj) {
    if (this.user.admin) return true;
    return false;
  }
}
