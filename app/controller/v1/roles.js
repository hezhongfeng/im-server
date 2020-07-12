const Controller = require('egg').Controller;

class RolesController extends Controller {
  // INDEX
  async index() {
    const { ctx } = this;

    const option = {
      offset: ctx.query.pageNumber,
      limit: ctx.query.pageSize
    };

    ctx.body = await ctx.model.Role.findAndCountAll(option);
  }

  // POST
  async create() {
    const { ctx } = this;
    const role = await ctx.model.Role.create(ctx.request.body);

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: role
    };
  }

  // PUT
  async update() {
    const { ctx } = this;
    console.log(ctx.request.body);
    const role = ctx.model.Role.findByPk(ctx.request.body.id);
    await role.update(ctx.request.body);
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
      const role = await ctx.model.Role.findByPk(id);
      role.destroy();
    }
    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: {}
    };
  }

  async getUserRoles() {
    const { ctx } = this;

    const option = {
      offset: ctx.query.pageNumber,
      limit: ctx.query.pageSize
    };

    const user = await ctx.model.User.findByPk(ctx.params.userId);

    ctx.body = await user.getRoles();
  }
}

module.exports = RolesController;
