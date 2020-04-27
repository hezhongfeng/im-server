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

  // 同意或者拒绝加为好友
  async applyFriend() {
    const { ctx, service } = this;
    const { id, approval } = ctx.request.body;
    const apply = await ctx.model.Apply.findByPk(id);
    let errorMessage = '';
    let statusCode = '0';

    if (!apply) {
      errorMessage = '参数错误';
    } else if (approval) {
      if (apply.toId !== ctx.session.user.id) {
        errorMessage = '无此权限';
        statusCode = '2';
      } else {
        service.apply.approvalAddFriend({ fromId: apply.fromId, toId: apply.toId });
      }
    }

    apply.hasHandled = true;
    await apply.save();

    ctx.body = {
      statusCode,
      errorMessage,
      data: null
    };
  }

  // 同意或者拒绝进群
  async applyGroup() {
    const { ctx, service } = this;
    const { approval } = ctx.request.body;
    const apply = await ctx.model.Apply.findByPk(ctx.params.id);
    let group = null;
    let errorMessage = '';
    let statusCode = '0';

    if (!apply) {
      errorMessage = '参数错误';
    } else if (approval) {
      group = await ctx.model.Group.findByPk(apply.toId);
      if (group.ownerId !== ctx.session.user.id) {
        errorMessage = '无此权限';
        statusCode = '2';
      } else {
        service.apply.approvalAddGroup({ group, fromId: apply.fromId });
      }
    }

    apply.hasHandled = true;
    await apply.save();

    ctx.body = {
      statusCode,
      errorMessage,
      data: null
    };
  }
}

module.exports = ApplyController;
