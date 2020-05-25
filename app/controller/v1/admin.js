const Controller = require('egg').Controller;

class ApplyController extends Controller {
  async rolesIndex() {
    const { ctx } = this;

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: null
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

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: null
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
