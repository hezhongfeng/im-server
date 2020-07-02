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

## 需求简介

移动互联网发展至今，以微信为首的即时通讯服务已经融入了我们生活中的各个角落，在公司的一些业务中也扮演着重要的角色，对于即时通讯我们公司原来是使用的环信的服务，但是有很多定制化的需求无法实现，所以后来决定内部开发一个满足定制化需求的即时通讯微服务。

使用`socket.io`框架是因为当时后端缺人，加上看了一些例子后觉得使用起来真的很方便，而且全平台支持，所以这个微服务就在前端进行落地实践。

为了总结下在 IM 这块的落地实践，决定使用 `socket.io` 作为 IM 的核心部分，完成整套不掺杂公司业务的 IM 通信示例，包含服务端，管理端和客户端。

这个项目是为了总结下 IM 这块的落地实践，社区目前这方面的内容都比较少或者太简陋（只有一个公共的聊天室这种）。另外就是在业务开发过程中被 PM 搞得很难受，所以想脱离一些特有的业务上的东西，实现一个功能简单五脏俱全的一个应用。客户端的模仿对象是微信，因为我很熟悉，不用在产品上面思考太多，另外就是试用的人很熟悉，不需要太多的沟通成本。

## 框架简介

要开发一套完整的即时通讯服务，需要以下部分：

1. 服务端：用来实现基础的服务接口和数据持久化
2. 客户端：完成登录、聊天等基础功能，类似微信
3. 管理端：管理群组、用户和角色权限

### server

> 为企业级框架和应用而生

选用阿里的 egg.js 框架做支撑，看中的原因是他们内部大规模的落地和安全方面做得比较好，没有选择 nest 的原因是集成 socket.io 比较麻烦

### admin

> 开箱即用的中台前端/设计解决方案

选择 Ant Design Pro 作为模板开发管理端，选用的原因是我对 Vue 全家桶比较熟悉，想借着这个机会熟悉下整套 React 的开发流程，感受下目前国内两大开发框架的本质区别和殊途同归，Ant Design Pro 已经发布了好几年了，也的确会给中小型企业带来效率的提升，也正好适合我这的需求。

### client

> 🛠️ Vue.js 开发的标准工具

使用 @vue/cli 搭建 IM 服务的客户端，一个移动端的 H5 项目，集成了开源组件[vue-page-stack](https://github.com/hezhongfeng/vue-page-stack)，实现 IM 的基础功能

## 关系

作为一个前端工程师，很多时候的工作是不需要思考实体关系的。但是，就我的实际体验来看，懂得实体关系可以帮助我们更好的理解业务模型。而对产品和业务理解的提升对我们的帮助是非常大的，可以在需求评审的时候发现很多不符合逻辑的地方，这时候能提出来就会主动避免我们在后续的过程中进行反复开发，同时可以和产品侧的同学形成比较良好的互动（而不是互怼）。下面简单罗列下比较重要的实体关系：

<img width="800" src="https://i.loli.net/2020/07/02/geLbqwCarGz8f4N.png">

通过上图可以看到 user 是整个关系图中的核心，下面介绍下各个实体的关系：

1. user 和 user_info(用户信息) 是一对一的关系
2. user 和 user_status(用户状态) 是一对一的关系
3. user 和 role(角色)是多对多的关系
4. role 和 right(权限)是多对多的关系
5. user 和 apply(申请)是多对多的关系，申请都是涉及到两个 user（申请人和被申请人）
6. user 和 group(群组)是多对多的关系
7. group 和 conversation(会话) 是一对一的关系
8. friend 和 conversation(会话) 是一对一的关系
9. conversation 和 message(消息)是 1 对多的关系
10. friend(好友关系) 和 user 没有直接关系，friend 由两个 user 确定

### 角色和权限

为了设计一个灵活、通用、方便的权限管理系统，本系统采用 RBAC（基于角色的访问控制）控制，来设计一个通用的『用户角色权限』平台，方便后期扩展。

#### RBAC

RBAC（基于角色的访问控制）是指用户通过角色与权限进行关联。即一个用户拥有若干角色，每一个角色拥有若干权限。这样，就构造成“用户—角色—权限”的授权模型。在这种模型中，用户与角色之间、角色与权限之间，一般是多对多的关系。

#### 本系统的角色和权限

本系统有管理员和一般用户这两种角色，给不同的角色分配不同的权限，所以需要针对管理和普通用户的接口路由做一下统一的鉴权（通过中间件的方式）处理，具体方式和方法在后端项目中会详细说明。本系统暂时采用预先定义了角色和权限的方式，后续想要扩展的话可以开放对角色和权限的分别配置功能。

#### 普通用户

注册登录后，可以正常的添加好友和加入群组，可以修改个人基础信息和处理申请

1. 注册登录
2. 编辑个人基础信息
3. 添加好友，申请入群
4. 处理好友申请和入群申请
5. 聊天
6. 群主踢人

#### 管理员

没见过微信的管理端，但是可以想象一下，管理员可以编辑配置群组和用户的状态，可以编辑角色和权限：

1. 用户的登录、发言权限
2. 禁言、解散群
3. 角色和权限的动态编辑

### 会话

完成一个即时通讯应用，需要考虑的第一个事情就是会话，就是我们微信里面的对话窗口。思考会话和消息、用户、群组之间的关系花费了不少的精力，最终形成以下的基本关系：

1. 2 个用户参与的聊天属于建立了 Friend 关系（互为好友）
2. 多个用户参与的聊天组成了群组关系
3. Friend 和会话之间的关系是 1 对 1 的关系，可以通过 Friend 找到此 Friend 的会话，也可以通过会话确定 Friend
4. 群组和会话之间的关系是 1 对 1 的关系，可以通过群组找到此群组的会话，也可以通过会话确定群组
5. 消息属于某个会话，可以根据会话查看对应的消息列表

也就是说，用户和会话没有直接的关系，只能通过用户对应的单聊和群聊去获取会话，这样做可以有以下的好处：

1. 无论是单聊还是群聊，连接上的用户只要 join 进对应的会话 room 里面就可以，消息也是在对应的 room 里面发布
2. 无论是单聊还是群聊，消息的保存和查询都比较简单，都是只针对这个会话
3. 获取个人的会话列表也变得很简单，用户的会话列表通过查询用户『所有的 Friend 和群组』->『所有的会话』->『排序会话(根据激活时间)』，就可以获取

### 聊天

聊天分为单聊和群聊，聊天信息暂时有一般的文字、图片消息

## 即时通讯

开发一个完整的即时通讯服务需要什么呢？和一般的 http 服务一样，得有一个服务端和客户端进行通讯，只不过详细的协议和处理方式不一样。

### WebSocket

由于历史原因，现在主流的 http 协议是无状态协议（HTTP2 暂时应用不广泛），只能由客户端主动发起请求，然后服务端去响应。那么为了实现服务端向客户端推送信息，就需要前端主动向后端去轮询，这种方式低效且容易出错。

为了实现这种服务端主动推送信息的需求， HTML5 开始提供一种在单个 TCP 连接上进行全双工通讯的协议，也就是 WebSocket。WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。WebSocket 协议在 2008 年诞生，2011 年成为国际标准，目前绝大部分浏览器都已经支持了。

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

有了 WebSocket 协议让我们使服务端主动推送信息有了先进的武器，那么有没有什么方式可以兼容新旧浏览器呢？其实很多人想到了这点，答案就是`socket.io`

### `socket.io`

`socket.io`进一步封装了`WebSocket`的接口，而且可以在旧版本浏览器中切换到使用轮询的方式进行通讯（我们使用者是不会感知的），形成了一套统一的接口，大大减轻了开发的负担。主要具有以下优点：

1. 封装出了一套非常易用的接口，前后端统一，使用非常简单
2. 全平台支持（原生和 H5，微信小程序中也有对应的实现）
3. 自适应浏览器，在比较老的浏览器中主动切换使用轮询的方式，不需要我们自己搞轮询

[这是 socket.io 主页](https://socket.io/)

> 最快，最可靠的即时通讯引擎(FEATURING THE FASTEST AND MOST RELIABLE REAL-TIME ENGINE)

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
