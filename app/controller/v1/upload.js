const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');

class uploadController extends Controller {
  async upload() {
    const { ctx } = this;

    const data = [];
    for (const file of ctx.request.files) {
      // 生成文件路径，注意upload文件路径需要存在
      const filePath = `./public/upload/${
        Date.now() + Math.floor(Math.random() * 100000).toString() + '.' + file.filename.split('.').pop()
      }`;
      const reader = fs.createReadStream(file.filepath); // 创建可读流
      const upStream = fs.createWriteStream(filePath); // 创建可写流
      reader.pipe(upStream); // 可读流通过管道写入可写流
      data.push({
        url: filePath.slice(1)
      });
    }

    ctx.body = {
      statusCode: '0',
      errorMessage: null,
      data: data
    };
  }
}

module.exports = uploadController;
