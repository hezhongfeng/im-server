'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = `hi, 欢迎${ctx.session.user ? ctx.session.user.username : '来访'}`;
  }
}

module.exports = HomeController;
