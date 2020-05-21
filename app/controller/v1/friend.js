const Controller = require('egg').Controller;

class ApplyController extends Controller {
  // INDEX
  async index() {
    const { ctx } = this;
    const { Op } = this.app.Sequelize;

    const result = await ctx.model.Friend.findAndCountAll({
      where: {
        [Op.or]: [
          {
            userId: ctx.session.user.id
          },
          {
            friendId: ctx.session.user.id
          }
        ]
      }
    });

    const data = {
      count: result.count,
      rows: []
    };

    for (const iterator of result.rows) {
      const userId = iterator.userId === ctx.session.user.id ? iterator.friendId : iterator.userId;
      let user = await ctx.model.User.findByPk(userId);
      let userInfo = await user.getUserInfo();
      userInfo = userInfo.get({
        plain: true
      });
      user = user.get({
        plain: true
      });
      user.userInfo = userInfo;
      data.rows.push(user);
    }

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data
    };
  }
}

module.exports = ApplyController;
