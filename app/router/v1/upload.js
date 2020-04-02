module.exports = app => {
  const { router, controller } = app;

  // 上传
  router.post('/api/v1/upload', controller.v1.upload.upload);
};
