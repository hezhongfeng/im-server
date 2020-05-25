const isJSON = require('koa-is-json');

async function admin(ctx, next) {
  let { session } = ctx;

  // 判断admin角色
  if (session.user.roles.find('admin')) {
    await next();
  } else {
    ctx.redirect('/login');
  }
}
