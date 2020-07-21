'use strict';

/**
 * 状态管理
 */

const userMap = new Map();

module.exports = app => {
  class Io extends app.Service {
    // 链接用户
    async connect(socket) {
      const { userId } = socket.handshake.query;
      this.addUser({ socketId: socket.id, userId });
    }

    // 断开客服or客户
    async disconnect(socket) {
      const { userId } = socket.handshake.query;
      this.removeUser({ socketId: socket.id, userId });
    }

    // 添加新User
    addUser({ socketId, userId }) {
      if (userMap.has(userId)) {
        userMap.get(userId).sockets.push(socketId);
      } else {
        userMap.set(userId, {
          sockets: [socketId],
          messages: []
        });
      }
    }

    removeUser({ socketId, userId }) {
      if (!userMap.has(userId)) {
        return;
      }
      let sockets = userMap.get(userId).sockets;
      let socketIndex = userMap.get(userId).sockets.indexOf(socketId);
      if (socketIndex !== -1) {
        sockets.splice(socketIndex, 1);
        if (sockets.length === 0) {
          userMap.delete(userId);
        }
      }
    }

    // 发送消息
    async sendMessage(message) {
      // 这里这么做是为了保持和查询消息的结构一致性，也为了消息有个唯一的ID
      const newMessage = await this.saveMessage(message);
      app.io.to(message.conversationId).emit('/v1/im/new-message', newMessage);
    }

    // 存储消息
    async saveMessage(message) {
      const { ctx } = this;
      const conversation = await ctx.model.Conversation.findByPk(message.conversationId);
      // 注意这里要更新下会话的激活时间
      conversation.activeTime = new Date();

      let newMessage = await ctx.model.Message.create({
        body: message.body,
        fromId: message.fromId,
        toId: message.toId
      });

      await conversation.addMessage(newMessage);
      await conversation.save();

      // 注意这里重新查询是为了和已经持久化的model格式统一
      newMessage = await ctx.model.Message.findByPk(newMessage.id);

      return {
        id: newMessage.id,
        body: newMessage.body,
        fromId: newMessage.fromId,
        toId: newMessage.toId,
        createdAt: newMessage.createdAt,
        conversationId: message.conversationId
      };
    }

    async getMessages({ conversationId, pageSize = 10, pageNumber = 1 }, callBack) {
      const { ctx } = this;
      // 计数查询
      let result = await ctx.model.Message.findAndCountAll({
        where: {
          conversationId: conversationId
        },
        offset: pageSize * (pageNumber - 1),
        limit: pageSize,
        order: [['created_at', 'DESC']]
      });

      callBack({
        conversationId,
        pageSize,
        pageNumber,
        count: result.count,
        messages: result.rows
      });
    }

    async robot(message) {
      const { ctx } = this;
      await ctx.socket.emit('/v1/im/new-message', message);
      const res = await ctx.service.baidu.chat(message.body.msg);
      const robotMessage = {
        ...message,
        fromId: message.toId,
        toId: message.fromId
      };
      robotMessage.body.msg = res.data.result.response_list[0].action_list[0].say;
      await ctx.socket.emit('/v1/im/new-message', robotMessage);
    }
  }
  return Io;
};
