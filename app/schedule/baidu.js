module.exports = app => {
  return {
    schedule: {
      interval: '999m',
      type: 'all'
    },
    async task(ctx) {
      ctx.service.baidu.getToken();
    }
  };
};
