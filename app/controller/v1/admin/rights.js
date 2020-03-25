const Controller = require('egg').Controller;

class RolesController extends Controller {
  // INDEX
  async index() {
    const { ctx } = this;

    const option = {
      offset: ctx.query.pageNumber,
      limit: ctx.query.pageSize
    };

    ctx.body = await ctx.model.Right.findAndCountAll(option);
  }

  // POST
  async create() {
    const { ctx } = this;
    const right = await ctx.model.Right.create(ctx.request.body);

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: right
    };
  }

  // PUT
  async update() {
    const { ctx } = this;
    console.log(ctx.request.body);
    const right = ctx.model.Right.findByPk(ctx.request.body.id);
    await right.update(ctx.request.body);
    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: {}
    };
  }

  // DELETE
  async destroy() {
    const { ctx } = this;
    for (const id of ctx.request.body.ids) {
      const right = await ctx.model.Right.findByPk(id);
      right.destroy();
    }
    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: {}
    };
  }

  async getRoleRights() {}

  async updateRoleRights() {}
}

module.exports = RolesController;
