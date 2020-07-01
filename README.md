<img width="464" src="https://i.loli.net/2020/07/01/AmsnawZ29RbUqk8.png">

即时通讯应用, 包含[服务端](https://github.com/hezhongfeng/im-server)、[管理端](https://github.com/hezhongfeng/im-fe-admin)和[客户端](https://github.com/hezhongfeng/im-fe-vue)

## 介绍

使用 egg 框架，IM 服务的服务端

## 功能简介

1. 注册，登录，个人、群组聊天，个人信息编辑等基础功能
2. 申请添加好友和申请入群
3. 表情，图片信息支持
4. 聊天会话列表记录
5. 在线离线显示
6. 支持多点同时登录
7. 支持消息漫游
8. 百度 UNIT 机器人自动回复
9. 管理端，进行禁言或者封账号，解散群（我也当一回马化腾）

## 基础概念简介

对于即时通讯我们公司原来是使用的环信的服务，但是有很多定制化的需求无法实现，所以决定自己开发一个满足定制化需求的即时通讯微服务。

使用`socket.io`框架是因为当时后端缺人，加上看了一些例子后觉得使用起来真的很方便，而且全平台支持，所以这个微服务就在前端进行落地实践。

## 即时通讯

### WebSocket

我们知道现在的 http 协议是无状态协议，只能由客户端主动发起请求，然后服务端去响应。那么为了实现服务端向客户端推送信息，就需要前端主动向后端去轮询，这种方式低效且容易出错。

为了解决这种需求， HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议，也就是 WebSocket。WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。WebSocket 协议在 2008 年诞生，2011 年成为国际标准，目前绝大部分浏览器都已经支持了。

WebSocket 的用法相当简单:

```
var ws = new WebSocket("wss://echo.websocket.org");

ws.onopen = function(evt) {
  console.log("Connection open ...");
  ws.send("Hello WebSockets!");
};

ws.onmessage = function(evt) {
  console.log( "Received Message: " + evt.data);
  ws.close();
};

ws.onclose = function(evt) {
  console.log("Connection closed.");
};
```

有了 WebSocket 协议让我们使服务端主动推送有了先进的武器，那么有没有什么方式可以兼容新旧浏览器呢？答案就是`socket.io`

### `socket.io`

`socket.io`进一步封装了`WebSocket`的接口，而且可以在旧版本浏览器中切换到使用轮询的方式进行通讯（我们使用者是不会感知的），形成了一套统一的接口，大大减轻了开发的负担。主要具有以下优点：

1. 封装出了一套非常易用的接口，前后端统一，使用非常简单
2. 全平台支持（原生和 H5，微信小程序中也有对应的实现）
3. 自适应浏览器，在比较老的浏览器中主动切换使用轮询的方式，不需要我们自己搞轮询

[socket.io 主页](https://socket.io/)

> 最快，最可靠的即时通讯引擎(FEATURING THE FASTEST AND MOST RELIABLE REAL-TIME ENGINE)

### 会话

思考会话和消息、用户、群组之间的关系花费了不少的精力，最终形成以下的基本关系：

1. 消息属于某个会话，可以根据会话查看对应的消息列表
2. 用户和会话的关系是多对多的关系，一个会话可以包含多个用户（只包含 2 个就是单聊），用户也可以包含多个会话（也就是我们的会话列表）
3. 群组和会话之间的关系是 1 对 1，可以通过群组找到此群组的会话，也可以通过会话确定群组

这样的话就可以保证，无论是单聊还是群聊，连接上的用户只要 join 进对应的会话 room 里面就可以了，消息也是在对应的 room 里面发布，消息列表的保存和查询都比较简单，还有每个人的会话列表的维护也变得很简单

## 框架简介

### server

选用阿里的 egg.js 框架做支撑，看中的原因是他们内部大规模的落地和安全方面做得比较好，没有选择 nest 的原因是当时集成 socket.io 比较麻烦

### front-end

我本身对`Vue`是比较熟悉的了，最近想使用下`React`感受下不同的设计思路，所以准备先使用`Vue`实现出一个移动端的 H5 项目，然后再使用`React`实现一个桌面端。

## server 端详细说明

### passport

这个章节的官方文档，要你的命，一定要去看源码，太坑人了，我研究了一整天才弄明白是怎么回事。因为我想更自由的控制账户密码登录，所以账号密码登录并没有使用 passport，使用的就是普用的 controller 控制的。

下面详细说下使用第三方平台（我选用的是 GitHub）登录的过程：

1. 在[GitHub OAuth Apps](https://github.com/settings/applications/new)新建你的应用
1. 在项目安装 egg-passport 和 egg-passport-github
1. 开启插件：

```
// config/plugin.js
module.exports.passport = {
  enable: true,
  package: 'egg-passport',
};

module.exports.passportGithub = {
  enable: true,
  package: 'egg-passport-github',
};
```

3. 配置：

```
// config/default.js
config.passportGithub = {
  key: 'your_clientID',
  secret: 'your_clientSecret',
  callbackURL: '/v1/passport/github/callback' // 注意这里非常的关键，这里需要和你在github上面设置的Authorization callback URL一致，我开发的时候想换github上面设置的Authorization callback URL一直报错，后来发现需要在这里配置
};
```

4. 需要设置两个 passport 的 get 请求路由，第一个是我们在 login 页面点击的请求，第二个是我们在上一步设置的 callbackURL，这里主要是第三方平台会给我们一个可用的 code，然后根据 OAuth2 授权规则去获取用户的详细信息

```
const github = app.passport.authenticate('github', { successRedirect: '/v1/passport' });// successRedirect就是最后校验完毕后前端会跳转的路由
router.get('/v1/passport/github', github);
router.get('/v1/passport/github/callback', github);
```

5. 获取到详细信息后，我们需要在 app.js 里面的 app.passport.verify 去验证用户信息，并且和我们自身平台的用户信息做关联，也要授权给 session

```
// 在verify函数我们只能获取ctx和user
module.exports = async (ctx, user) => {
  const { provider, id, name, photo } = user;
  if (provider === 'github') {
    // 查询auth是否已经注册
    const auth = await ctx.model.Authorization.findOne({
      where: {
        provider,
        uid: id
      }
    });
    if (!auth) {
      // 如果没有注册的话就需要使用拿到的user信息注册下
      const newAuth = await ctx.model.Authorization.create({
        provider,
        uid: id,
        username: name
      });
      const user = await ctx.model.User.create({
        nickname: name,
        photo
      });
      newAuth.setUser(user);
      // 这步和下面的功能一样，添加auth到session
      ctx.session.auth = newAuth;
    } else {
      ctx.session.auth = auth;
    }
  }
  return user;
};
```

### 统一鉴权

因为本系统有管理员和一般通信用户的不同角色，所以需要针对管理和通信的接口路由做一下统一的鉴权处理。

比如管理端的路由`/v1/admin/...`，想在这个系列路由全都添加管理员的鉴权，这时候可以用中间件的方式进行鉴权，各种具体的细分权限可以在 controller 层完成，下面是在 router 中使用中间件的例子

```
module.exports = app => {
  const gzip = app.middleware.gzip({ threshold: 1024 });
  app.router.get('/needgzip', gzip, app.controller.handler);
};
```

### 消息

message 的结构设计参考了几家第三方服务的设计，也结合本项目自身的情况做如下说明：

```
const Message = app.model.define('message', {
  /**
    * 消息类型：
    * 0:单聊
    * 1:群聊
    */
  type: {
    type: STRING
  },
  // 消息体
  body: {
    type: JSON
  },
  fromId: { type: INTEGER },
  toId: { type: INTEGER }
});
```

body 里面存放的是消息体，使用 json 用来存放不同的消息格式：

```
// 文本消息
{
  "type": "txt",
  "msg":"哈哈哈" //消息内容
}
```

```
// 图片消息
{
  "type": "img",
  "url": "http://nimtest.nos.netease.com/cbc500e8-e19c-4b0f-834b-c32d4dc1075e",
  "ext":"jpg",
  "w":360,    //宽
  "h":480,    //高
  "size": 388245
}
```

```
// 视频消息
{
  "type": 'video',
  "url": "http://nimtest.nos.netease.com/cbc500e8-e19c-4b0f-834b-c32d4dc1075e",
  "ext":"mp4",
  "w":360,    //宽
  "h":480,    //高
  "size": 388245
}
```

```
// 地理位置消息
{
  "type": "loc",
  "title":"中国 浙江省 杭州市 网商路 599号",    //地理位置title
  "lng":120.1908686708565,        // 经度
  "lat":30.18704515647036            // 纬度
}
```

## 部署

docker
