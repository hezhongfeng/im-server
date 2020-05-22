const Controller = require('egg').Controller;

class ApplyController extends Controller {
  // INDEX
  async index() {
    const { ctx } = this;

    const result = await ctx.model.Apply.findAndCountAll({
      where: {
        userId: ctx.session.user.id,
        hasHandled: false
      }
    });

    const data = {
      count: result.count,
      rows: []
    };

    for (const iterator of result.rows) {
      const apply = {
        type: iterator.type,
        id: iterator.id,
        toId: iterator.toId,
        fromId: iterator.fromId
      };
      let fromUser = await ctx.model.User.findByPk(apply.fromId);
      let userInfo = await fromUser.getUserInfo();
      userInfo = userInfo.get({
        plain: true
      });
      fromUser = fromUser.get({
        plain: true
      });
      fromUser.userInfo = userInfo;
      apply.from = fromUser;
      if (apply.type === 'user') {
        let toUser = await ctx.model.User.findByPk(apply.toId);
        userInfo = await toUser.getUserInfo();
        userInfo = userInfo.get({
          plain: true
        });
        toUser = toUser.get({
          plain: true
        });
        toUser.userInfo = userInfo;
        apply.to = toUser;
      } else if (apply.type === 'group') {
        apply.to = await ctx.model.Group.findByPk(apply.toId);
      }
      data.rows.push(apply);
    }

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
    let errorMessage = null;
    let isExist = null;
    let apply = null;
    let statusCode = '0';

    if (type === 'user') {
      isExist = await ctx.service.friend.isFriend({
        userId: ctx.session.user.id,
        friendId: toId
      });
      if (isExist) {
        errorMessage = '你们已经是好友关系了';
        statusCode = '1';
      }
    } else if (type === 'group') {
      const group = await ctx.model.Group.findByPk(toId);
      const users = await group.getUsers();
      isExist = users.find(item => item.id === ctx.session.user.id);
      if (isExist) {
        statusCode = '1';
        errorMessage = '你们已经是群中的一员了';
      }
    }

    if (!isExist) {
      apply = await ctx.service.apply.create({
        type: type,
        fromId: ctx.session.user.id,
        toId: toId
      });
    }

    ctx.body = {
      statusCode,
      errorMessage,
      data: apply
    };
  }

  // 同意或者拒绝加为好友
  async applyFriend() {
    const { ctx } = this;
    const { id, approval } = ctx.request.body;
    const apply = await ctx.model.Apply.findByPk(id);
    let errorMessage = '';
    let statusCode = '0';
    let data = null;

    if (!apply) {
      errorMessage = '参数错误';
    } else if (approval) {
      if (apply.toId !== ctx.session.user.id) {
        errorMessage = '无此权限';
        statusCode = '2';
      } else {
        const [friend] = await ctx.service.friend.create({
          userId: apply.fromId,
          friendId: apply.toId
        });
        data = friend.get({
          plain: true
        });
        data.target = {
          id: ctx.session.user.id === friend.userId ? friend.friendId : friend.userId
        };
      }
    }

    apply.hasHandled = true;
    await apply.save();

    ctx.body = {
      statusCode,
      errorMessage,
      data
    };
  }

  // 同意或者拒绝进群
  async applyGroup() {
    const { ctx, service } = this;
    const { id, approval } = ctx.request.body;
    const apply = await ctx.model.Apply.findByPk(id);
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
      data: group
    };
  }
}

module.exports = ApplyController;
