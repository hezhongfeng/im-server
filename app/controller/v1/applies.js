const Controller = require('egg').Controller;

class ApplyController extends Controller {
  // INDEX
  async index() {
    const { ctx } = this;

    const data = await ctx.model.Apply.findAndCountAll({
      where: {
        toId: ctx.session.user.id
      }
    });

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data
    };
  }

  // create申请
  async create() {
    const { ctx } = this;
    const { type, toId } = ctx.request.body;

    const apply = await ctx.model.Apply.findOrCreate({
      where: {
        type: type,
        fromId: ctx.session.user.id,
        toId: toId
      }
    });

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: apply
    };
  }

  // 同意或者拒绝
  async apply() {
    const { ctx, service } = this;
    const { hasHandled } = ctx.request.body;
    const apply = await ctx.model.Apply.findByPk(ctx.params.id);
    let group = null;
    let errorMessage = '';
    let statusCode = '0';

    if (!apply) {
      errorMessage = '参数错误';
    } else if (hasHandled) {
      switch (apply.type) {
        case 'user':
          if (apply.toId !== ctx.session.user.id) {
            errorMessage = '无此权限';
            statusCode = '2';
          } else {
            service.apply.approvalAddFriend({ fromId: apply.fromId, toId: apply.toId });
          }
          break;
        case 'group':
          group = await ctx.model.Group.findByPk(apply.toId);
          if (group.ownerId !== ctx.session.user.id) {
            errorMessage = '无此权限';
            statusCode = '2';
          } else {
            service.apply.approvalAddGroup({ group, fromId: apply.fromId });
          }
          break;
        default:
          break;
      }
    }

    apply.hasHandled = hasHandled;
    await apply.save();

    ctx.body = {
      statusCode,
      errorMessage,
      data: null
    };
  }
}

module.exports = ApplyController;
