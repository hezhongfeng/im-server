'use strict';
// const urls = require('../libs/urls');

/**
 * 状态管理
 */

/**
 * 在线用户map
 * id: user.id,
 * sockets: ['ssd1asdsd','323sdwerfw22']
 * messages: []
 */
const userMap = new Map();

module.exports = app => {
  class Io extends app.Service {
    // 链接用户
    async connect(socket) {
      const { id } = socket.handshake.query;
      this.addUser({ socketId: socket.id, id });

      // 获取在线的cs和client集合
      const userList = await this.getOnlineUserList();
      // 向本socket发送
      // await this.ctx.socket.emit('/v1/user-list-change', {
      //   userList
      // });
      // 广播
      this.ctx.socket.broadcast.emit('/v1/user-list-change', {
        userList
      });
    }

    // 断开客服or客户
    async disconnect(socket) {
      const { id } = socket.handshake.query;
      this.removeUser({ socketId: socket.id, id });
      const userList = this.getOnlineUserList();
      // 广播
      this.ctx.socket.broadcast.emit('/v1/cs/user-list-change', {
        userList
      });
    }

    // 添加新User
    addUser({ socketId, id }) {
      if (userMap.has(id)) {
        userMap.get(id).sockets.push(socketId);
      } else {
        userMap.set(id, {
          sockets: [socketId],
          messages: []
        });
      }
    }

    removeUser({ socketId, id }) {
      if (!userMap.has(id)) {
        return;
      }
      let socketIndex = userMap.get(id).sockets.indexOf(socketId);
      if (socketIndex !== -1) {
        sockets.splice(socketIndex, 1);
        if (sockets.length === 0) {
          userMap.delete(id);
        }
      }
    }

    // 获取当前在线userList
    getOnlineUserList() {
      const userList = [];
      for (const id of userMap.keys()) {
        userList.push(id);
      }
      return userList;
    }
  }
  return Io;
};
