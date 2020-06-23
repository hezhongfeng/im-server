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
          const createdAt = ['created_at'];
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

  async groupsUpdate() {
    const { ctx } = this;

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
