const Controller = require('egg').Controller;

class ApplyController extends Controller {
  async rolesIndex() {
    const { ctx } = this;
    const pageSize = Number(ctx.query.pageSize);
    const pageNumber = Number(ctx.query.pageNumber);

    const option = {
      offset: pageSize * (pageNumber - 1),
      limit: pageSize
    };

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: await ctx.model.Role.findAndCountAll(option)
    };
  }

  async rolesUpdate() {
    const { ctx } = this;

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: null
    };
  }

  async groupsIndex() {
    const { ctx } = this;

    const pageSize = Number(ctx.query.pageSize);
    const pageNumber = Number(ctx.query.pageNumber);
    const sorter = JSON.parse(ctx.query.sorter);
    const order = [];

    for (const key in sorter) {
      if (sorter.hasOwnProperty(key)) {
        console.log(key);
        if (key === 'updatedAt') {
          const createdAt = ['updated_at'];
          if (sorter[key] === 'descend') {
            createdAt.push('DESC');
          }
          order.push(createdAt);
        }
      }
    }

    console.log(order);

    const option = {
      offset: pageSize * (pageNumber - 1),
      limit: pageSize,
      order: order
    };

    console.log(option);

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: await ctx.model.Group.findAndCountAll(option)
    };
  }

  async groupsMute() {
    const { ctx } = this;
    const { mute, id } = ctx.request.body;

    let group = await ctx.model.Group.findByPk(id);
    if (!group) {
      ctx.body = {
        statusCode: '1',
        errorMessage: '无此群组',
        data: null
      };
    }

    group.mute = mute;

    await group.save();

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: null
    };
  }

  async groupsDisabled() {
    const { ctx } = this;
    const { disabled, id } = ctx.request.body;

    let group = await ctx.model.Group.findByPk(id);
    if (!group) {
      ctx.body = {
        statusCode: '1',
        errorMessage: '无此群组',
        data: null
      };
    }

    group.disabled = disabled;

    await group.save();

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: null
    };
  }

  async usersIndex() {
    const { ctx } = this;

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: null
    };
  }

  async usersUpdate() {
    const { ctx } = this;

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: null
    };
  }
}

module.exports = ApplyController;
