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
    const fromUser = await this.ctx.model.User.findByPk(fromId);
    await group.addUser(fromUser);
  }
}

module.exports = ApplyService;
