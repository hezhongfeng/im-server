const Controller = require('egg').Controller;

class AddController extends Controller {
  async search() {
    const { ctx } = this;
    const { Op } = this.app.Sequelize;
    const { searchValue } = ctx.request.body;

    const groups = await ctx.model.Group.findAll({ where: { name: { [Op.like]: '%' + searchValue + '%' } } });
    const users = await ctx.model.User.findAll({
      where: { username: { [Op.like]: '%' + searchValue + '%' } },
      attributes: { exclude: ['password'] }
    });
    const userInstances = [];
    for (const user of users) {
      const userInfo = await user.getUserInfo();
      const userInstance = user.get({
        plain: true
      });
      userInstance.userInfo = userInfo.get({
        plain: true
      });
      userInstances.push(userInstance);
    }

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: {
        users: userInstances,
        groups
      }
    };
  }

  async addFriend() {
    const { ctx } = this;

    // const { id } = ctx.request.body;
    // const groups = await ctx.model.Group.findAll({ where: { name: searchValue } });
    // const users = await ctx.model.User.findAll({ where: { username: searchValue } });

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: null
    };
  }
}

module.exports = AddController;
