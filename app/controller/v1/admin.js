const Controller = require('egg').Controller;

class ApplyController extends Controller {
  async rightsIndex() {
    const { ctx } = this;
    const pageSize = Number(ctx.query.pageSize);
    const pageNumber = Number(ctx.query.pageNumber);

    const option = {
      offset: pageSize * (pageNumber - 1),
      limit: pageSize
    };

    const data = await ctx.model.Right.findAndCountAll(option);

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data
    };
  }

  async rightsCreate() {
    const { ctx } = this;
    const { name, keyName, desc = '' } = ctx.request.body;

    let right = await ctx.model.Right.findOne({ where: { keyName } });
    if (right) {
      ctx.body = {
        statusCode: '1',
        errorMessage: '已有此权限',
        data: null
      };
      return;
    }

    const data = await ctx.model.Right.create({
      name,
      keyName,
      desc
    });

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data
    };
  }

  async rightsUpdate() {
    const { ctx } = this;
    const { id, name, keyName, desc = '' } = ctx.request.body;

    let right = await ctx.model.Right.findByPk(id);
    if (!right) {
      ctx.body = {
        statusCode: '1',
        errorMessage: '无此权限',
        data: null
      };
      return;
    }

    right.name = name;
    right.keyName = keyName;
    right.desc = desc;

    await right.save();

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: null
    };
  }

  async rightsDelete() {
    const { ctx } = this;
    const { id } = ctx.request.body;

    let right = await ctx.model.Right.findByPk(id);
    if (!right) {
      ctx.body = {
        statusCode: '1',
        errorMessage: '无此权限',
        data: null
      };
      return;
    }
    right.destroy();

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: null
    };
  }

  async rolesIndex() {
    const { ctx } = this;
    const pageSize = Number(ctx.query.pageSize);
    const pageNumber = Number(ctx.query.pageNumber);

    const option = {
      offset: pageSize * (pageNumber - 1),
      limit: pageSize
    };

    const data = await ctx.model.Role.findAndCountAll(option);

    for (let role of data.rows) {
      let rights = await role.getRights();
      for (let right of rights) {
        right = right.get({
          plain: true
        });
      }
      role = role.get({
        plain: true
      });
      role.rights = rights;
    }

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data
    };
  }

  async updateRoles() {
    const { ctx } = this;
    const { id, rightIds, name, keyName, desc } = ctx.request.body;
    const role = await ctx.model.Role.findByPk(id);
    const rights = [];

    for (const id of rightIds) {
      rights.push(await ctx.model.Right.findByPk(id));
    }
    role.name = name;
    role.keyName = keyName;
    role.desc = desc;
    await role.setRights(rights);
    await role.save();
    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: null
    };
  }

  async createRoles() {
    const { ctx } = this;
    const { name, keyName, desc, rightIds } = ctx.request.body;
    const { Op } = this.app.Sequelize;

    let role = await ctx.model.Role.findOne({
      where: {
        [Op.or]: [
          {
            name
          },
          {
            keyName
          }
        ]
      }
    });
    if (role) {
      ctx.body = {
        statusCode: '1',
        errorMessage: '已有此角色名称或者关键字',
        data: null
      };
      return;
    }
    role = await ctx.model.Role.create({
      name,
      keyName,
      desc
    });
    const rights = [];

    for (const id of rightIds) {
      rights.push(await ctx.model.Right.findByPk(id));
    }
    await role.setRights(rights);
    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: role
    };
  }

  async deleteRoles() {
    const { ctx } = this;
    const { ids } = ctx.request.body;

    for (const id of ids) {
      const role = await ctx.model.Role.findByPk(id);
      await role.destroy();
    }
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
      return;
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
      return;
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
    const { Op } = this.app.Sequelize;

    const pageSize = Number(ctx.query.pageSize);
    const pageNumber = Number(ctx.query.pageNumber);
    const sorter = JSON.parse(ctx.query.sorter);
    const where = {};
    const username = ctx.query.username || '';
    const provider = ctx.query.provider || '';
    const order = [];

    for (const key in sorter) {
      if (sorter.hasOwnProperty(key)) {
        console.log(key);
        if (key === 'createdAt') {
          const createdAt = ['created_at'];
          if (sorter[key] === 'descend') {
            createdAt.push('DESC');
          }
          order.push(createdAt);
        }
      }
    }

    if (username) {
      where.username = { [Op.like]: '%' + username + '%' };
    }

    if (provider) {
      where.provider = provider;
    }

    const option = {
      offset: pageSize * (pageNumber - 1),
      limit: pageSize,
      order: order,
      attributes: { exclude: ['password'] },
      where
    };

    const data = await ctx.model.User.findAndCountAll(option);

    for (let user of data.rows) {
      let userInfo = await user.getUserInfo();
      userInfo = userInfo.get({
        plain: true
      });
      let roles = await user.getRoles();
      for (let role of roles) {
        role = role.get({
          plain: true
        });
      }
      user = user.get({
        plain: true
      });
      user.userInfo = userInfo;
      user.roles = roles;
    }

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data
    };
  }

  async usersRoles() {
    const { ctx } = this;
    const { roleIds, id } = ctx.request.body;

    let user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.body = {
        statusCode: '1',
        errorMessage: '无此用户',
        data: null
      };
      return;
    }

    const roles = [];

    for (const roleId of roleIds) {
      roles.push(await ctx.model.Role.findByPk(roleId));
    }

    await user.setRoles(roles);

    await user.save();

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: null
    };
  }
}

module.exports = ApplyController;
