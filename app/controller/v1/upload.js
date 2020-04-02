const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');

class uploadController extends Controller {
  async upload() {
    const { ctx } = this;

    const file = ctx.request.files[0];
    // const filePath = `upload/${Math.random().toString()}` + path.basename(file.filename);
    const filePath = `upload/${Math.random().toString()}` + path.basename('123.mp4');

    // const file = ctx.request.body.files.file; // 获取上传文件
    const reader = fs.createReadStream(file.path); // 创建可读流
    // const ext = file.name.split('.').pop(); // 获取上传文件扩展名
    const upStream = fs.createWriteStream(filePath); // 创建可写流
    reader.pipe(upStream);

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: [{ url: filePath }]
    };
  }
}

module.exports = uploadController;
